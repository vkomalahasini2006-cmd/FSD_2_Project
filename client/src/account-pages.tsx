import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Box, Camera, Check, CircleUserRound, Heart, Package, ShieldCheck, Trash2 } from 'lucide-react';
import { apiRequest } from './api';
import { useAuth } from './auth-context';
import { useApp } from './context';
import { useProducts } from './products-context';
import { categories } from './data';
import type { BookingRecord, Product, UserRole } from './types';
import { formatCurrency, rentalDays } from './utils';

function LoginPage() {
  const { login, register, user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('renter');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const redirect = searchParams.get('redirect') ?? '/';
  const destination = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';

  if (user) return <Navigate to={destination} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, fullName, phone, role });
      }
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="auth-page"><div className="auth-art"><Link to="/" className="brand"><span className="brand-mark"><Box size={20} /></span><span>Rent<span>Kart</span></span></Link><div><p className="kicker">A better way to borrow</p><h1>More possibilities.<br /><em>Less stuff.</em></h1><p>Join your neighbourhood rental community.</p></div><div className="auth-quote">Rent what you need, from people nearby.</div></div><div className="auth-card"><div className="auth-tabs"><button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Log in</button><button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Create account</button></div><h2>{mode === 'login' ? 'Welcome back' : 'Start renting smarter'}</h2><p>{searchParams.get('reason') === 'cart' ? 'Log in to add this item to your cart. You will return to the product afterward.' : mode === 'login' ? 'Enter your details to continue.' : 'Create your free RentKart account.'}</p><form onSubmit={submit}><label>Email address<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>{mode === 'register' && <><label>Full name<input required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" /></label><label>Phone number<input required autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" /></label><label>Account type<select required value={role} onChange={(event) => setRole(event.target.value as UserRole)}><option value="renter">Renter</option><option value="owner">Owner</option></select></label></>}<label>Password<div className="password-input"><input required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{mode === 'register' && <label className="check-label"><input type="checkbox" required checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} /><span>I agree to RentKart's terms and community rules.</span></label>}{error && <p className="error-text" role="alert">{error}</p>}<button className="primary-button full" type="submit" disabled={submitting || (mode === 'register' && !acceptedTerms)}>{submitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'} <ArrowRight size={17} /></button></form></div></main>;
}

export function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { user, loading, error, retryProfile } = useAuth();
  const location = useLocation();
  if (loading) return <main className="page-shell"><p>Checking your account...</p></main>;
  if (error && !user) return <main className="page-shell"><p className="error-text" role="alert">{error}</p><button className="primary-button" onClick={retryProfile}>Retry</button></main>;
  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }
  if (role && user.role !== role) {
    return <main className="page-shell"><div className="empty-state"><h2>This page is for {role}s</h2><p>Your account is registered as a {user.role}. Roles cannot be changed after signup.</p><Link className="primary-button" to={user.role === 'owner' ? '/owner-dashboard' : '/browse'}>Continue <ArrowRight size={17} /></Link></div></main>;
  }
  return <>{children}</>;
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return <main className="page-shell"><div className="page-title"><div><p className="kicker">Your account</p><h1>Profile</h1><p>Your RentKart account details.</p></div></div><section className="summary-card profile-details"><div className="owner-card"><div className="owner-avatar"><CircleUserRound size={22} /></div><div><span>Signed in as</span><strong>{user.fullName}</strong></div><span className="status-pill">{user.role === 'owner' ? 'Owner' : 'Renter'}</span></div><div className="summary-line"><span>Full name</span><strong>{user.fullName}</strong></div><div className="summary-line"><span>Email</span><strong>{user.email}</strong></div><div className="summary-line"><span>Phone</span><strong>{user.phone}</strong></div><div className="summary-line"><span>Account type</span><strong>{user.role === 'owner' ? 'Owner' : 'Renter'}</strong></div><div className="summary-line"><span>Member since</span><strong>{new Date(user.createdAt).toLocaleDateString()}</strong></div><button className="secondary-button" onClick={() => { logout(); navigate('/'); }}>Log out</button></section></main>;
}

function CheckoutPage() {
  const { cart, clearCart } = useApp();
  const { token, user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const rent = cart.reduce((sum, item) => sum + item.product.dailyPrice * rentalDays(item.startDate, item.endDate), 0);
  const deposit = cart.reduce((sum, item) => sum + item.product.securityDeposit, 0);

  const confirmBooking = async () => {
    if (!token || !cart.length) return;
    setSubmitting(true);
    setError('');
    try {
      await apiRequest('/bookings', {
        method: 'POST',
        token,
        body: JSON.stringify({
          notes,
          items: cart.map(({ product, startDate, endDate }) => ({ productId: product.id, startDate, endDate })),
        }),
      });
      clearCart();
      setConfirmed(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) return <main className="page-shell"><div className="confirmation"><div className="confirmation-icon"><Check size={31} /></div><p className="kicker">Booking request sent</p><h1>You're all set.</h1><p>Your request has been saved. The owner will confirm availability before payment or pickup details are shared.</p><div className="confirmation-actions"><Link to="/my-rentals" className="primary-button">View my rentals <ArrowRight size={17} /></Link><Link to="/browse" className="secondary-button">Keep browsing</Link></div></div></main>;
  if (!cart.length) return <main className="page-shell"><div className="empty-state"><h2>Add a rental before checkout</h2><p>Your checkout summary will appear here once you choose an item.</p><Link to="/browse" className="primary-button">Browse rentals</Link></div></main>;

  return <main className="page-shell checkout-page"><div className="breadcrumb"><Link to="/cart">Rental cart</Link> › Checkout</div><div className="page-title"><div><p className="kicker">One last look</p><h1>Confirm your rental request</h1><p>Review your details. No payment is processed now.</p></div></div><div className="checkout-layout"><section className="checkout-form"><h2>Pickup or meetup instructions</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Share a preferred public meetup spot or any notes for the owner..." /><h2>Contact details</h2><div className="two-fields"><label>Full name<input readOnly value={user?.fullName ?? ''} /></label><label>Phone number<input readOnly value={user?.phone ?? ''} /></label></div><label className="check-label"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>I agree to the rental rules, cancellation policy and returning the item in the same condition.</span></label>{error && <p className="error-text" role="alert">{error}</p>}<button className="primary-button" disabled={!accepted || submitting} onClick={confirmBooking}>{submitting ? 'Submitting...' : 'Confirm booking request'} <ArrowRight size={17} /></button></section><aside className="summary-card"><h2>Rental summary</h2>{cart.map((item) => <div className="checkout-item" key={item.product.id}><img src={item.product.image} alt="" /><div><strong>{item.product.title}</strong><span>{rentalDays(item.startDate, item.endDate)} days · {item.startDate}</span></div></div>)}<div className="summary-line"><span>Rental charges</span><strong>{formatCurrency(rent)}</strong></div><div className="summary-line"><span>Refundable deposits</span><strong>{formatCurrency(deposit)}</strong></div><div className="summary-total"><span>Total payable</span><strong>{formatCurrency(rent + deposit)}</strong></div><p className="summary-note"><ShieldCheck size={14} /> Exact owner address and payment options appear only after approval.</p></aside></div></main>;
}

function MyRentalsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    apiRequest<BookingRecord[]>('/bookings', { token })
      .then(setBookings)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load your bookings.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <main className="page-shell">Loading your rentals...</main>;
  if (error) return <main className="page-shell"><p className="error-text" role="alert">{error}</p></main>;
  return <main className="page-shell rentals-page"><div className="page-title"><div><p className="kicker">Your rental journey</p><h1>My rentals</h1><p>Keep track of your requests, active rentals and returns.</p></div></div>{bookings.length ? <div className="booking-list">{bookings.map((booking) => <article className="booking-card" key={booking.id}><Package size={22} /><div><span className="status-pill">{booking.status}</span><h3>Booking {booking.id.slice(0, 8)}</h3>{booking.items.map((item) => <p key={item.product.id}>{item.product.title} · {item.startDate} — {item.endDate} · {formatCurrency(item.product.dailyPrice * rentalDays(item.startDate, item.endDate))}</p>)}<small>{new Date(booking.createdAt).toLocaleString()}</small></div></article>)}</div> : <div className="empty-state"><h2>No rental requests yet</h2><p>Once you submit a booking request, it will appear here.</p><Link to="/browse" className="primary-button">Browse rentals <ArrowRight size={17} /></Link></div>}<div className="status-guide"><h2>Rental status guide</h2><div><span className="status-dot requested" /><strong>Requested</strong><span>Owner is reviewing your request</span></div><div><span className="status-dot approved" /><strong>Approved</strong><span>Dates and pickup are confirmed</span></div><div><span className="status-dot active" /><strong>Active</strong><span>You have the item</span></div><div><span className="status-dot completed" /><strong>Completed</strong><span>Item returned successfully</span></div></div></main>;
}

type ListingForm = {
  title: string;
  description: string;
  category: string;
  dailyPrice: string;
  securityDeposit: string;
  condition: Product['condition'];
  location: string;
};

function ListItemPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<ListingForm>({
    title: '', description: '', category: '', dailyPrice: '', securityDeposit: '',
    condition: 'Like new', location: 'Guntur',
  });
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const update = (key: keyof ListingForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const selectImage = async (file?: File) => {
    if (!file) return;
    if (file.size > 1_800_000) {
      setError('Please choose an image smaller than 1.8 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => setError('Unable to read the selected image.');
    reader.readAsDataURL(file);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!token || !image) {
      setError('Choose a product photo before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest<Product>('/products', {
        method: 'POST',
        token,
        body: JSON.stringify({
          ...form,
          dailyPrice: Number(form.dailyPrice),
          securityDeposit: Number(form.securityDeposit),
          image,
        }),
      });
      navigate('/owner-dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create listing.');
    } finally {
      setSubmitting(false);
    }
  };
  return <main className="page-shell list-page"><div className="page-title"><div><p className="kicker">Give your things a second life</p><h1>List your item</h1><p>Share something useful with people nearby. You stay in control of the price and dates.</p></div></div><form className="listing-form" onSubmit={submit}><section><h2>Tell us about it</h2><div className="two-fields"><label>Item title<input required maxLength={100} value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Canon EOS DSLR Camera" /></label><label>Category<select required value={form.category} onChange={(event) => update('category', event.target.value)}><option value="">Choose a category</option>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label></div><label>Description<textarea required maxLength={2000} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What should renters know about your item?" /></label><div className="two-fields"><label>Daily rental price<input required type="number" min="1" value={form.dailyPrice} onChange={(event) => update('dailyPrice', event.target.value)} placeholder="₹ 500" /></label><label>Refundable deposit<input required type="number" min="0" value={form.securityDeposit} onChange={(event) => update('securityDeposit', event.target.value)} placeholder="₹ 3,000" /></label></div><div className="two-fields"><label>Condition<select value={form.condition} onChange={(event) => update('condition', event.target.value as Product['condition'])}><option>Like new</option><option>Excellent</option><option>Good</option></select></label><label>General location<select value={form.location} onChange={(event) => update('location', event.target.value)}><option>Guntur</option><option>Vijayawada</option><option>Hyderabad</option><option>Vizag</option></select></label></div></section><section><h2>Photos & availability</h2><div className="upload-box"><input id="photos" type="file" accept="image/*" onChange={(event) => { setError(''); void selectImage(event.target.files?.[0]); }} /><label htmlFor="photos"><Camera size={26} /><strong>Add a clear photo</strong><span>Choose one image under 1.8 MB</span></label></div>{image && <div className="photo-preview"><img src={image} alt="Listing preview" /></div>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit listing'} <ArrowRight size={17} /></button>{error && <p className="error-text" role="alert">{error}</p>}</section></form></main>;
}

function OwnerDashboardPage() {
  const { token } = useAuth();
  const { wishlist, toggleWishlist, isWishlisted } = useApp();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [activeTab, setActiveTab] = useState<'listings' | 'wishlist'>('listings');
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadListings = () => {
    if (!token) return;
    setLoading(true);
    setError('');
    apiRequest<Product[]>('/products/owner', { token })
      .then(setListings)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load listings.'))
      .finally(() => setLoading(false));
  };
  useEffect(loadListings, [token]);

  const remove = async (id: string) => {
    if (!token) return;
    setDeleting(id);
    setError('');
    try {
      await apiRequest<void>(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', token });
      setListings((current) => current.filter((product) => product.id !== id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete listing.');
    } finally {
      setDeleting(null);
    }
  };

  const savedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <main className="page-shell rentals-page">
      <div className="page-title">
        <div>
          <p className="kicker">Your marketplace</p>
          <h1>Owner dashboard</h1>
          <p>Manage your listings and explore items to rent.</p>
        </div>
        <Link to="/list-item" className="primary-button">Create a listing <ArrowRight size={17} /></Link>
      </div>

      <div className="tabs" style={{ marginBottom: '28px' }}>
        <button
          className={activeTab === 'listings' ? 'active' : ''}
          onClick={() => setActiveTab('listings')}
        >
          <Package size={15} style={{ display: 'inline', marginRight: 6 }} />
          My Listings {listings.length > 0 && <b style={{ marginLeft: 4 }}>{listings.length}</b>}
        </button>
        <button
          className={activeTab === 'wishlist' ? 'active' : ''}
          onClick={() => setActiveTab('wishlist')}
        >
          <Heart size={15} style={{ display: 'inline', marginRight: 6 }} />
          My Wishlist {wishlist.length > 0 && <b style={{ marginLeft: 4 }}>{wishlist.length}</b>}
        </button>
      </div>

      {error && <p className="error-text" role="alert">{error}</p>}

      {activeTab === 'listings' && (
        loading ? (
          <p>Loading your listings...</p>
        ) : listings.length ? (
          <div className="booking-list">
            {listings.map((product) => (
              <article className="booking-card" key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <span className="eyebrow">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p>{formatCurrency(product.dailyPrice)} / day · {product.location}</p>
                </div>
                <button
                  className="secondary-button"
                  disabled={deleting === product.id}
                  onClick={() => void remove(product.id)}
                  aria-label={`Delete ${product.title}`}
                >
                  <Trash2 size={16} />{deleting === product.id ? 'Removing...' : 'Remove'}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={28} />
            <h2>No listings yet</h2>
            <p>Create your first listing to start earning from items you own.</p>
            <Link to="/list-item" className="primary-button">Create a listing <ArrowRight size={17} /></Link>
          </div>
        )
      )}

      {activeTab === 'wishlist' && (
        productsLoading ? (
          <p>Loading wishlist...</p>
        ) : savedProducts.length ? (
          <div className="booking-list">
            {savedProducts.map((product) => (
              <article className="booking-card" key={product.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} alt="" />
                <div style={{ flex: 1 }}>
                  <span className="eyebrow">{product.category}</span>
                  <h3>{product.title}</h3>
                  <p>{formatCurrency(product.dailyPrice)} / day · {product.location}</p>
                  <small style={{ color: '#89949e' }}>Deposit: {formatCurrency(product.securityDeposit)} · {product.condition}</small>
                </div>
                <button
                  className={`secondary-button${isWishlisted(product.id) ? ' active' : ''}`}
                  style={{ color: '#e65365', borderColor: '#fcd5db', background: '#fff5f6' }}
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  aria-label={`Remove ${product.title} from wishlist`}
                >
                  <Heart size={16} fill="currentColor" /> Saved
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={28} />
            <h2>Your wishlist is empty</h2>
            <p>Tap the heart icon on any rental to save it here for later.</p>
            <Link to="/browse" className="primary-button">Browse rentals <ArrowRight size={17} /></Link>
          </div>
        )
      )}
    </main>
  );
}

export { CheckoutPage, LoginPage, ListItemPage, MyRentalsPage, OwnerDashboardPage, ProfilePage };
