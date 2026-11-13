
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  LogOut,
  User,
  X
} from 'lucide-react';

import api from './api';

const StoreContext = createContext(null);

function useStore() {
  return useContext(StoreContext);
}

const fallbackImage =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700';

function StoreProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [cart, setCartState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  function setCart(value) {
    setCartState(previous => {
      const next = typeof value === 'function'
        ? value(previous)
        : value;

      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
  }

  function addToCart(product) {
    if (!product || product.stock <= 0) return;

    setCart(previous => {
      const existing = previous.find(item => item.id === product.id);

      if (existing) {
        return previous.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                )
              }
            : item
        );
      }

      return [
        ...previous,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  }

  return (
    <StoreContext.Provider
      value={{
        user,
        cart,
        setCart,
        saveSession,
        logout,
        addToCart
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function Navbar() {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-icon">N</span>
        NORTHSTAR<span className="brand-light">.</span>
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <a href="/#collection">Collection</a>
        {user?.role === 'ADMIN' && (
          <Link to="/admin">Admin</Link>
        )}
        {user && <Link to="/orders">My orders</Link>}
      </nav>

      <div className="head-actions">
        {user ? (
          <>
            <span className="muted">
              <User size={14} style={{ verticalAlign: 'middle' }} />{' '}
              {user.name}
            </span>
            <button
              className="text-button"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut size={15} /> Sign out
            </button>
          </>
        ) : (
          <Link to="/login" className="text-button">
            Sign in
          </Link>
        )}

        <Link to="/cart" className="icon-link" aria-label="Shopping cart">
          <ShoppingBag size={20} />
          <span className="cart-count">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <Link to="/" className="brand">
        <span className="brand-icon">N</span>
        NORTHSTAR.
      </Link>
      <span>Thoughtfully selected goods. © {new Date().getFullYear()} NORTHSTAR.</span>
      <span>Good things. Better living.</span>
    </footer>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useStore();

  return (
    <article>
      <Link to={`/product/${product.id}`} className="product-photo">
        <img
          src={product.imageUrl || fallbackImage}
          alt={product.name}
          onError={e => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        {(!product.stock || product.stock <= 0) && (
          <span className="sold">Sold out</span>
        )}
      </Link>

      <div className="product-info">
        <span className="category">{product.category || 'Essentials'}</span>
        <h3>
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-bottom">
          <b>${Number(product.price || 0).toFixed(2)}</b>
          <button
            className="add-btn"
            title="Add to cart"
            disabled={!product.stock || product.stock <= 0}
            onClick={() => addToCart(product)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(err => {
        console.error('Products API error:', err);
        setError('Unable to load products. Please check that the backend is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All',
    ...new Set(products.map(p => p.category).filter(Boolean))
  ];

  const filtered = products.filter(product => {
    const matchesCategory =
      category === 'All' || product.category === category;

    const matchesSearch =
      (product.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THOUGHTFULLY SELECTED GOODS</span>
          <h1>
            Good things.
            <br />
            <i>Better living.</i>
          </h1>
          <p>
            Discover everyday essentials designed to bring a little more
            joy to your routine.
          </p>
          <a href="#collection" className="btn dark">
            Explore collection <ArrowRight size={17} />
          </a>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200"
            alt="Thoughtfully selected lifestyle collection"
          />
        </div>
      </section>

      <main className="container" id="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE NORTHSTAR EDIT</span>
            <h2>Find your everyday favourite.</h2>
          </div>

          <label className="search">
            <Search size={16} />
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="filters">
          {categories.map(item => (
            <button
              key={item}
              className={`filter ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && <p className="empty">Loading products...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="empty">No products found.</p>
        )}

        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(err => {
        console.error(err);
        setError('Product could not be found.');
      });
  }, [id]);

  if (error) {
    return <main className="container page"><p className="error">{error}</p><Link to="/">Back to shop</Link></main>;
  }

  if (!product) {
    return <main className="container page">Loading product...</main>;
  }

  return (
    <main className="container page detail">
      <img
        src={product.imageUrl || fallbackImage}
        alt={product.name}
        onError={e => { e.currentTarget.src = fallbackImage; }}
      />

      <div>
        <span className="eyebrow">{product.category || 'NORTHSTAR COLLECTION'}</span>
        <h1>{product.name}</h1>
        <h2>${Number(product.price || 0).toFixed(2)}</h2>
        <p>{product.description}</p>
        <p className="stock">
          {product.stock > 0
            ? `${product.stock} available`
            : 'Currently out of stock'}
        </p>
        <button
          className="btn dark"
          disabled={!product.stock || product.stock <= 0}
          onClick={() => addToCart(product)}
        >
          Add to cart <ShoppingBag size={16} />
        </button>
      </div>
    </main>
  );
}

function AuthPage({ register = false }) {
  const { saveSession } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = register ? '/auth/register' : '/auth/login';

      const body = register
        ? { name, email, password }
        : { email, password };

      const response = await api.post(endpoint, body);

      if (!response.data?.token || !response.data?.user) {
        throw new Error('The server returned an invalid login response.');
      }

      saveSession(response.data);
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME TO NORTHSTAR</span>
        <h1>{register ? 'Create account' : 'Welcome back.'}</h1>
        <p className="muted">
          {register
            ? 'Create an account to begin shopping.'
            : 'Sign in to continue to your account.'}
        </p>

        {register && (
          <label>
            Full name
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
        )}

        <label>
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            minLength={register ? 8 : undefined}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn dark full" disabled={loading}>
          {loading
            ? 'Please wait...'
            : register ? 'Create account' : 'Sign in'}
          <ArrowRight size={16} />
        </button>

        <p className="switch">
          {register ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={register ? '/login' : '/register'}>
            {register ? 'Sign in' : 'Create account'}
          </Link>
        </p>
      </form>
    </main>
  );
}

function Cart() {
  const { cart, setCart } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  function changeQuantity(id, amount) {
    setCart(previous =>
      previous
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(1, item.quantity + amount),
                  item.stock || item.quantity
                )
              }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  return (
    <main className="container page">
      <span className="eyebrow">YOUR SELECTION</span>
      <h1>Shopping bag</h1>

      {cart.length === 0 ? (
        <p className="empty">
          Your cart is empty. <Link to="/">Explore the collection</Link>
        </p>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.map(item => (
              <div className="cart-row" key={item.id}>
                <img
                  src={item.imageUrl || fallbackImage}
                  alt={item.name}
                  onError={e => { e.currentTarget.src = fallbackImage; }}
                />

                <div className="cart-name">
                  <b>{item.name}</b>
                  <span>${Number(item.price).toFixed(2)}</span>
                  <button
                    className="remove"
                    onClick={() => setCart(previous =>
                      previous.filter(p => p.id !== item.id)
                    )}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                <div className="quantity">
                  <button onClick={() => changeQuantity(item.id, -1)}>
                    <Minus size={12} />
                  </button>
                  {item.quantity}
                  <button
                    disabled={item.quantity >= item.stock}
                    onClick={() => changeQuantity(item.id, 1)}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <b>${(item.price * item.quantity).toFixed(2)}</b>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h3>Order summary</h3>
            <div><span>Subtotal</span><b>${total.toFixed(2)}</b></div>
            <div><span>Delivery</span><b>Free</b></div>
            <hr />
            <div className="total"><b>Total</b><b>${total.toFixed(2)}</b></div>
            <button
              className="btn dark full"
              onClick={() => navigate('/checkout')}
            >
              Continue to checkout <ArrowRight size={16} />
            </button>
            <p className="muted tiny">Cash on Delivery available.</p>
          </aside>
        </div>
      )}
    </main>
  );
}

function Checkout() {
  const { cart, setCart, user } = useStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!cart.length) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/orders', {
        shippingAddress: address,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      setCart([]);
      navigate('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err.response?.data?.message ||
        'Could not place your order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!cart.length) {
    return (
      <main className="container page empty">
        Your cart is empty. <Link to="/">Shop now</Link>
      </main>
    );
  }

  return (
    <main className="auth-wrap">
      <form className="auth-card wide" onSubmit={submit}>
        <span className="eyebrow">ALMOST YOURS</span>
        <h1>Checkout</h1>

        {!user && (
          <p className="error">Please sign in before placing your order.</p>
        )}

        <label>
          Delivery address
          <textarea
            required
            rows="4"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="House number, street, city, state, PIN code"
          />
        </label>

        <div className="payment">
          <ShieldCheck size={23} />
          <div>
            <b>Cash on Delivery</b>
            <p className="muted tiny">Pay in cash when your order arrives.</p>
          </div>
        </div>

        <h3>Order total: ${total.toFixed(2)}</h3>

        {error && <p className="error">{error}</p>}

        <button className="btn dark full" disabled={loading}>
          {loading ? 'Placing order...' : 'Place order'}
          <ArrowRight size={17} />
        </button>
      </form>
    </main>
  );
}

function Orders() {
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api.get('/orders')
      .then(response => {
        setOrders(Array.isArray(response.data) ? response.data : []);
      })
      .catch(err => {
        console.error('Orders API error:', err);
        setError(
          err.response?.data?.message ||
          'Unable to load your orders. Please try again.'
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <main className="container page empty">
        Please <Link to="/login">sign in</Link> to view your orders.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container page">
        <h1>Loading your orders...</h1>
      </main>
    );
  }

  return (
    <main className="container page">
      <span className="eyebrow">YOUR NORTHSTAR ACCOUNT</span>
      <h1>Order history</h1>

      {error && <p className="error">{error}</p>}

      {!error && orders.length === 0 && (
        <p className="empty">
          No orders yet. <Link to="/">Explore the collection</Link>
        </p>
      )}

      {orders.map(order => (
        <article className="order-card" key={order.id}>
          <div className="order-top">
            <b>Order #{order.id}</b>
            <span className="status">{order.status || 'PLACED'}</span>
          </div>

          <p className="muted tiny">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'Date unavailable'}
            {' · '}
            {order.paymentMethod || 'COD'}
          </p>

          <p>
            {Array.isArray(order.items)
              ? order.items.map(item =>
                  `${item.product?.name || item.productName || 'Product'} × ${item.quantity || 1}`
                ).join(', ')
              : 'Order items unavailable'}
          </p>

          <b>${Number(order.total || 0).toFixed(2)}</b>

          <p className="muted tiny">
            Deliver to: {order.shippingAddress || 'Address unavailable'}
          </p>
        </article>
      ))}
    </main>
  );
}

function Admin() {
  const { user } = useStore();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const emptyProduct = {
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stock: 10,
    active: true
  };

  const [form, setForm] = useState(emptyProduct);

  async function loadAdminData() {
    try {
      const [productResponse, orderResponse] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/orders')
      ]);

      setProducts(Array.isArray(productResponse.data) ? productResponse.data : []);
      setOrders(Array.isArray(orderResponse.data) ? orderResponse.data : []);
      setError('');
    } catch (err) {
      console.error('Admin data error:', err);
      setError(
        err.response?.data?.message ||
        'Could not load admin data. Check your admin permissions.'
      );
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') loadAdminData();
  }, [user]);

  async function saveProduct(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        setMessage('Product updated successfully.');
      } else {
        await api.post('/admin/products', payload);
        setMessage('Product added successfully.');
      }

      setForm(emptyProduct);
      setEditingId(null);
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to save product.');
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock ?? 0,
      active: product.active ?? true
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deactivateProduct(id) {
    if (!window.confirm('Deactivate this product?')) return;

    try {
      await api.delete(`/admin/products/${id}`);
      setMessage('Product deactivated.');
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to deactivate product.');
    }
  }

  async function updateOrderStatus(id, status) {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      setMessage(`Order #${id} updated.`);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update order.');
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <main className="container page empty">
        Admin access required. <Link to="/">Return to shop</Link>
      </main>
    );
  }

  return (
    <main className="container page">
      <span className="eyebrow">NORTHSTAR MANAGEMENT</span>
      <h1>Admin dashboard</h1>

      {error && <p className="error">{error}</p>}
      {message && <p>{message}</p>}

      <div className="admin-grid">
        <section className="panel">
          <h2>{editingId ? 'Edit product' : 'Add a product'}</h2>

          <form className="admin-form" onSubmit={saveProduct}>
            <input
              required
              placeholder="Product name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              required
              placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            />

            <input
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />

            <input
              required
              type="number"
              min="0"
              placeholder="Stock"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
            />

            <input
              className="full"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            />

            <input
              className="full"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <button className="btn dark full">
              {editingId ? 'Save changes' : 'Add product'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn full"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyProduct);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
        </section>

        <section className="panel">
          <h2>Products ({products.length})</h2>

          {products.map(product => (
            <div className="admin-line" key={product.id}>
              <span>
                <b>{product.name}</b>
                <br />
                ${Number(product.price || 0).toFixed(2)} · Stock: {product.stock}
              </span>

              <span>
                <button
                  className="text-button"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="text-button"
                  onClick={() => deactivateProduct(product.id)}
                >
                  <X size={14} /> Deactivate
                </button>
              </span>
            </div>
          ))}
        </section>
      </div>

      <section className="panel orders-panel">
        <h2>Customer orders ({orders.length})</h2>

        {orders.map(order => (
          <div className="admin-line" key={order.id}>
            <span>
              <b>Order #{order.id}</b>
              <br />
              ${Number(order.total || 0).toFixed(2)}
              {' · '}
              {order.paymentMethod || 'COD'}
            </span>

            <select
              value={order.status || 'PLACED'}
              onChange={e => updateOrderStatus(order.id, e.target.value)}
            >
              <option value="PLACED">PLACED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        ))}
      </section>
    </main>
  );
}

function App() {
  return (
    <StoreProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <main className="container page empty">
              Page not found. <Link to="/">Return home</Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </StoreProvider>
  );
}

export default App;
