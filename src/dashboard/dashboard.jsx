import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js ne register karvani (dashboard ma bar chart) 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);   // Logged in state: aa boolean track karse ke user login chhe ke nahi
  const [loginUser, setLoginUser] = useState("");   // loginUser => username/email input value
  const [loginPass, setLoginPass] = useState(""); // loginPass => password input value
  const [showNotAdminModal, setShowNotAdminModal] = useState(false);    // Modal state: jo user admin nathi to aa modal show thase and kese undefined you are not admin 
  const [selectedCustomerId, setSelectedCustomerId] = useState("");   // Selected customer ID dropdown ya edit mate
  const [addCustomerModal, setAddCustomerModal] = useState(false);     // Add customer modal visible chhe ke nahi te track kare
  const [foundCustomer, setFoundCustomer] = useState(null);   // Je customer find thay te store karva mate state
  const [selectedCustomers, setSelectedCustomers] = useState([]);  // Track selected customers customer ne select karva mate 
  const [searchUser, setSearchUser] = useState("");// 🔍 Search state
  const [showpassword, setshowtpassword] = useState(false);  //password ne hide & show karva mate 
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageType, setImageType] = useState("");
  const [imageOrder, setImageOrder] = useState("");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
const [brand, setBrand] = useState("");
const [category, setCategory] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image ❌");
      return;
    }
  
    if (!imageType) {
      toast.error("Please select image type ❌");
      return;
    }
  
    if (imageType === "slider" && !imageOrder) {
      toast.error("Please enter image order for slider ❌");
      return;
    }
  
    try {
      setUploading(true);
  
      // 🔥 1️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "kvooief1");
  
      const cloudName = "dzde5sqph";
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
  
      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
  
      const imageUrl = data.secure_url;
  
      // 🔥 2️⃣ Decide Firestore Collection Dynamically
      let collectionName = "";
      let payload = {
        image: imageUrl,
        createdAt: new Date(),
      };
  
      switch (imageType) {
        case "hero":
          collectionName = "about";
          payload.section = "process";  // 👈 ADD THIS
          break;
  
        case "slider":
          collectionName = "arvindLookbook";
          payload.order = Number(imageOrder);
          break;
  
          case "suiting":
            case "shirting":
              collectionName = "products";
              payload.type = imageType;
              payload.title = title;
              payload.brand = brand;
              payload.category = category;
              break;
  
        default:
          toast.error("Invalid image type ❌");
          return;
      }
  
      // 🔥 3️⃣ Save to Firestore
      await addDoc(collection(db, collectionName), payload);
  
      toast.success("Image uploaded successfully ✅");
  
      // 🔥 Reset fields
      setImageFile(null);
      setImageOrder("");
      setImageType("");
      setTitle("");
setBrand("");
setCategory("");
  
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Image upload failed ❌");
    } finally {
      setUploading(false);
    }
  };







  const toggelepasswordvisibility = () => {
    setshowtpassword(!showpassword);
  };

  const [searchTerm, setSearchTerm] = useState("");


  // 📤 WhatsApp modal state
  const [whatsAppModal, setWhatsAppModal] = useState(false);  //whatsapp par message mokalva mate ek modal open karva mate 
  const [whatsAppText, setWhatsAppText] = useState("");   //whatsapp modal open thai pachi input type karva mate state 
  // Users & orders state

  // Edit Order Modal state
  const [editOrderModal, setEditOrderModal] = useState({
    show: false,
    order: null,
  });

  const openEditOrderModal = (order) => {
    setEditOrderModal({
      show: true,
      order: { ...order },
    });
  };

  const handleEditItemChange = (index, field, value) => {
    const updatedCart = [...editOrderModal.order.cart];
    updatedCart[index][field] = value;

    // Recalculate item total
    updatedCart[index].total =
      updatedCart[index].qty * updatedCart[index].price;

    // Recalculate grand total
    const newGrandTotal = updatedCart.reduce(
      (sum, item) => sum + item.total,
      0
    );

    setEditOrderModal({
      ...editOrderModal,
      order: {
        ...editOrderModal.order,
        cart: updatedCart,
        grandTotal: newGrandTotal,
      },
    });
  };

  // Sabhi sidebar items ko select karein
  const menuItems = document.querySelectorAll('.sidebar li');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Pehle se jo 'active' hai use remove karein
      document.querySelector('.sidebar li.active')?.classList.remove('active');

      // Ab naye clicked item par 'active' class lagayein
      item.classList.add('active');
    });
  });

  const saveEditedOrder = async () => {
    try {
      const updatedOrder = editOrderModal.order;

      const orderRef = doc(db, "orders", updatedOrder.id);

      await updateDoc(orderRef, {
        cart: updatedOrder.cart,
        grandTotal: updatedOrder.grandTotal,
      });

      // ✅ Update main orders state
      const updatedOrders = orders.map((o) =>
        o.id === updatedOrder.id ? updatedOrder : o
      );

      setOrders(updatedOrders);

      // ✅ VERY IMPORTANT: Update viewOrdersModal also
      if (viewOrdersModal.show) {
        const updatedCustomerOrders = updatedOrders.filter(
          (o) =>
            String(o.customerId) === String(viewOrdersModal.customer.id) ||
            String(o.form?.mobile) ===
            String(viewOrdersModal.customer.mobile)
        );

        setViewOrdersModal((prev) => ({
          ...prev,
          orders: updatedCustomerOrders,
        }));
      }

      setEditOrderModal({ show: false, order: null });
      toast.success("✅ Order updated successfully");
    } catch (error) {
      console.error(error);

    }
  };



  // Function to clear the customer form
  const clearCustomerForm = () => {
    // Form input ne empty string ma reset karo
    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      date: "",

    });

    setFoundCustomer(null);  // Pela find thayela customer ne reset karo
    setSelectedCustomerId("");     // Dropdown ne reset karo
    toast.info("Form cleared 🧹");


  };

  // State to manage the View Orders modal
  // Modal dekhaave chhe, orders show kare chhe, customer info store kare chhe
  const [viewOrdersModal, setViewOrdersModal] = useState({
    show: false,
    orders: [],
    customer: null,
  });

  // Function to open the View Orders modal for ek specific customer
  const handleViewOrders = (customer) => {
    // Badha orders maathi je orders aa customer na chhe te filter karo
    const customerOrders = orders.filter((o) => {
      // Jo order ane customer banne na IDs available chhe, to ID thi match karo
      if (o.customerId && customer.id) {
        return String(o.customerId) === String(customer.id);
      }

      // Jo IDs available nathi, to mobile number thi match karo (fallback)
      if (o.form?.mobile && customer.mobile) {
        return String(o.form.mobile) === String(customer.mobile);
      }

      // Bijoo koi match nathi, ignore karo
      return false;
    });

    // Modal state update karo: show modal ane customer + teni orders pass karo
    setViewOrdersModal({
      show: true,
      customer,
      orders: customerOrders,
    });
  };



  const resetAllForms = () => {
    setForm({
      name: "",
      mobile: "",
      email: "",
      address: "",
      date: "",
    });

    setCurrentOrder({
      brand: "",
      itemType: "",
      qty: 1,
      price: 0,
    });

    setCart([]);
    setSelectedCustomerId("");
    setFoundCustomer(null);
  };

 

  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem("activeView") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  // Customer form state
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    date: "",
  });

  // Current order state
  const [currentOrder, setCurrentOrder] = useState({
    brand: "",
    itemType: "",
    qty: 1, // Default qty
    price: 0,
  });

  // Cart ane payment state
  const [cart, setCart] = useState([]);

  // Users & orders state
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, orderId: null });  //delete modal 
  const [editModal, setEditModal] = useState({ show: false, user: null });  //edit modal




  useEffect(() => {
    // Auth state check karo, user logged in che ke nai
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true); // user login thai gayo
      } else {
        setLoggedIn(false); // user logout che
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase mathi users ane orders load karo
  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // users set karo

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // orders set karo
    };

    fetchData();
  }, []);

  // Orders localStorage ma save karo Firebase pachi
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);


  // Total sales calculate karo
  const totalSales = orders.reduce((a, o) => a + o.grandTotal, 0);


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginUser, loginPass);

      setLoggedIn(true);

      toast.success("Login successful ✅", {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error) {
      toast.error("Login failed ❌ Invalid credentials", {
        position: "top-right",
        autoClose: 3000,
      });

      setShowNotAdminModal(true);
    }
  };

  // User login pachi dashboard open rakho, refresh pachi pan dashboard show thae
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true); // user login, dashboard show
      } else {
        setLoggedIn(false); // user logout, login page show
      }
         setLoading(false); // important
    });

    return () => unsubscribe();
  }, []);

  const closeNotAdminModal = () => setShowNotAdminModal(false);

  // ===================== CART & ORDER =====================
  const addToCart = () => {
    if (!currentOrder.brand || !currentOrder.itemType) {
      toast.error("Select brand & item"); // validation
      return;
    }
    const total = currentOrder.qty * currentOrder.price; // total calculate
    setCart([...cart, { ...currentOrder, total, id: Date.now() }]); // cart ma add karo
    setCurrentOrder({ brand: "", itemType: "", qty: 1, price: 0 }); // order reset karo
  };

  // Order save karo Firebase ma
  const saveOrder = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Customer details required"); // validation
      return;
    }
    if (cart.length === 0) {
      toast.error("Add items to cart"); // validation
      return;
    }

    const grandTotal = cart.reduce((a, i) => a + i.total, 0); // grand total calculate

    const orderData = {
      customerId: form.id || null,   // customer ID important che
      form,
      cart,
      grandTotal,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData); // Firebase ma add karo
    setOrders([...orders, { ...orderData, id: docRef.id }]); // local state update
    resetAllForms();
    toast.success("Order confirmed successfully ✅");
  };

  // Customer save karo without order
  const saveCustomerOnly = async () => {
    if (!form.name || !form.mobile) {
      toast.error("Customer name & mobile required");
      return;
    }

    const existing = users.find(u => u.mobile === form.mobile);
    if (existing) {
      toast.warning("Customer already exists! Select from dropdown 👇");
      setForm(existing); // existing customer set karo form ma
      return;

    }

    const docRef = await addDoc(collection(db, "users"), form); // Firebase ma add karo
    setUsers([...users, { ...form, id: docRef.id }]); // local users update
    toast.success("Customer saved successfully ✅");
    resetAllForms();
  };

  // Customer select karva dropdown thi
  const handleSelectCustomer = (customer) => {
    setForm(customer);
    toast.success(`Customer ${customer.name} selected`);
  };


  // User ne edit modal kholva mate
  const openEditModal = (user) => setEditModal({ show: true, user });
  // Edit modal band karva mate
  const closeEditModal = () => setEditModal({ show: false, user: null });

  // Customer update karva function
  const handleUpdateCustomer = async () => {
    const userRef = doc(db, "users", editModal.user.id);
    await updateDoc(userRef, editModal.user);

    // Local users list update karvi
    const updatedUsers = users.map(u => u.id === editModal.user.id ? editModal.user : u);
    setUsers(updatedUsers);
    toast.success(`✅ Customer ${editModal.user.name} updated`);
    closeEditModal();
  };

  //user details seacrh karta filter karine khali search user j dekhai
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.mobile.includes(searchUser) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // ===================== DELETE ORDER =====================
  // Order delete modal kholva mate
  const openDeleteModal = (orderId) => {
    setDeleteModal({ show: true, orderId: orderId.toString() });
  };

  // Order confirm delete function
  const confirmDelete = async () => {
    if (!deleteModal.orderId) return;
    try {
      const orderRef = doc(db, "orders", deleteModal.orderId);
      await deleteDoc(orderRef);
      // Local orders list update karvi
      setOrders(orders.filter(o => o.id.toString() !== deleteModal.orderId));
      setDeleteModal({ show: false, orderId: null });
      toast.success("Order deleted successfully 🗑️");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete order");
    }
  };

  //send message on whatsapp 
  const sendWhatsAppWeb = () => {
    if (!selectedCustomers.length) {
      toast.error("No customers selected ❌");
      return;
    }

    const numbers = users
      .filter(u => selectedCustomers.includes(u.id))
      .map(u => u.mobile)
      .filter(num => /^\d{10}$/.test(num));

    if (!numbers.length) {
      toast.error("No valid numbers found ❌");
      return;
    }

    numbers.forEach(num => {
      const waUrl = `https://wa.me/91${num}?text=${encodeURIComponent(whatsAppText)}`;
      window.open(waUrl, "_blank");
    });

    toast.success(`WhatsApp opened for ${numbers.length} customers`);
    setWhatsAppModal(false);
    setWhatsAppText("");
  };


  // Top 5 VIP Customers 
  const vipCustomers = users.map(u => {
    const customerOrders = orders.filter(o => String(o.form.mobile) === String(u.mobile));
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    return { ...u, totalSpent, orderCount: customerOrders.length };
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const cancelDelete = () => setDeleteModal({ show: false, orderId: null });  // Delete modal cancel karva mate
  const latestOrder = orders.length ? orders[orders.length - 1] : null;   // Latest order fetch karva mate


  const updateOrderStatus = async (orderId, newStatus) => {

    try {

      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status: newStatus
      });

      // Local state update
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // 🔥 Dynamic Toast Based On Status
      if (newStatus === "Pending") {
        toast.warning("Order marked as Pending ⏳");
      }
      else if (newStatus === "Tailoring") {
        toast.info("Order is now in Tailoring 🧵");
      }
      else if (newStatus === "Ready") {
        toast.success("Order is Ready for Delivery 🎉");
      }
      else if (newStatus === "Completed") {
        toast.success("Order Completed Successfully ✅");
      }
      else {
        toast.success(`Order is ${newStatus}  Successfully ✅`);
      }

    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status ❌");
    }

  };

  
  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="fabric-loader"></div>
        <p>Loading....</p>
      </div>
    );
  }

  // ===================== LOGIN PAGE =====================
  if (!loggedIn) {
    return (
      <div className="login-container-rivaaj">
        {/* Background Decor Elements */}
        <div className="fabric-overlay"></div>

        <div className="login-glass-card">
          <div className="login-header">
            <div className="brand-icon">R</div>
            <h1>Rivaaj</h1>
            <p>The Fabric Shop | Admin Portal</p>
          </div>

          <div className="form-body">
            <div className="input-group-modern">
              <input
                type="text"
                required
                placeholder=" " /* Empty space for CSS label trick */
                onChange={(e) => setLoginUser(e.target.value)}
              />
              <label>Username</label>
              <div className="bar"></div>
            </div>

            <div className="input-group-modern">
              <input
                type={showpassword ? "text" : "password"}
                required
                placeholder=" "
                onChange={(e) => setLoginPass(e.target.value)}
              />
              <label>Password</label>

              <button
                type="button"
                className="password-toggle-icon"
                onClick={toggelepasswordvisibility}
                aria-label={showpassword ? "hide" : "show"}
              >
                {
                  showpassword ? (
                    <AiFillEyeInvisible size={22} />
                  ) : (
                    <AiFillEye size={22} />
                  )}

              </button>

              <div className="bar"></div>
            </div>

            <button className="login-btn-modern" onClick={handleLogin}>
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Admin Warning Modal */}
        {showNotAdminModal && (
          <div className="modal-overlay-blur">
            <div className="modal-content-pop">
              <div className="warning-icon">!</div>
              <h3>Access Denied</h3>
              <p>This portal is reserved for administrators only.</p>
              <button className="modal-close-btn" onClick={closeNotAdminModal}>
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===================== DASHBOARD =====================
  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="logo">
          Rivaaj <span>The Fabric Shop</span>
        </div>
        <nav>
          <ul>
            <li onClick={() => setActiveView("dashboard")}>Dashboard</li>
            <li onClick={() => setActiveView("users")} >Customer</li>
            <li onClick={() => setActiveView("orders")}>Orders</li>
            <li onClick={() => setActiveView("sales")}>Sales</li>
            <li onClick={() => setActiveView("images")}>Images</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => {
          auth.signOut(); // Firebase logout
        }}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />


        {/* DASHBOARD VIEW */}
        {activeView === "dashboard" && latestOrder && (
          <>
            <div className="summary-cards">
              <div className="card">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
              <div className="card">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="card">
                <h3>Total Sales</h3>
                <p>₹ {totalSales}</p>
              </div>
            </div>

            <div className="form-grid">

              {/* CUSTOMER FORM */}
              <div className="form-card">
                <h2>
                  Customer Details
                </h2>
                <div className="select-customer-dropdown">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedCustomerId(selectedId);

                      const selectedCustomer = users.find(
                        (u) => u.id.toString() === selectedId
                      );

                      if (selectedCustomer) {
                        handleSelectCustomer(selectedCustomer);
                      }
                    }}
                  >
                    <option value="">
                      Select Existing Customer
                    </option>

                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.mobile}
                      </option>
                    ))}
                  </select>

                </div>

                <input
                  placeholder="Customer Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="Mobile"
                  value={form.mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;

                    // sirf digits, max 10
                    if (!/^\d{0,10}$/.test(value)) return;

                    // typing ke time sirf warning, button NA dikhao
                    if (value.length === 10) {
                      const exists = users.find(
                        (u) => String(u.mobile) === String(value)
                      );

                      if (exists && !form.id) {
                        toast.error("Mobile number already exists ❌");
                        setFoundCustomer(null); // ❌ button hide
                      } else {

                        setFoundCustomer(null);
                      }
                    } else {

                      setFoundCustomer(null);
                    }

                    setForm({ ...form, mobile: value });
                  }}
                />

                <input
                  type="date"
                  required
                  className="modern-date-input"
                  data-placeholder="dd-mm-yyyy"
                  value={form.date || ""}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <button className="submit-btn" onClick={saveCustomerOnly}>
                  Save
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={clearCustomerForm}
                >
                  Clear Form
                </button>
              </div>

              {foundCustomer && (
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => {
                    setForm(foundCustomer);   // id ke saath form fill
                    setFoundCustomer(null);
                    toast.success("Existing customer loaded ✅");
                  }}
                >
                  Use {foundCustomer.mobile}
                </button>
              )}

              <div className="form-card">
                <h2>Order Details</h2>

                {/* Brand select */}
                <select
                  value={currentOrder.brand}
                  onChange={(e) =>
                    setCurrentOrder({
                      ...currentOrder,
                      brand: e.target.value,
                      itemType: "", // reset item name
                      price: 0,    // reset price
                      qty: 1,      // default quantity
                    })
                  }
                >
                  <option value="">Select Brand</option>
                  <option value="Raymond">Raymond</option>
                  <option value="Siyaram">Siyaram</option>
                  <option value="Arvind">Arvind</option>
                  <option value="Linen">Linen</option>
                  <option value="Jhampsted">Jhampsted</option>
                  <option value="Reid & Taylor">Reid & Taylor</option>
                </select>

                {/* Item select */}
                {currentOrder.brand && (
                  <select
                    value={currentOrder.itemType}
                    onChange={(e) =>
                      setCurrentOrder({
                        ...currentOrder,
                        itemType: e.target.value,
                        price: 0, // reset price so user can input manually
                        qty: 1,
                      })
                    }
                  >
                    <option value="">Select Item</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pant">Pant</option>
                    <option value="Suit">Suit</option>
                  </select>
                )}


                {/* Price input */}
                {currentOrder.brand && currentOrder.itemType && (
                  <input

                    placeholder="Price per item"
                    min="0"
                    value={currentOrder.price}
                    onChange={(e) =>
                      setCurrentOrder({ ...currentOrder, price: Number(e.target.value) })
                    }
                  />
                )}

                {/* Quantity input */}
                {currentOrder.price > 0 && (
                  <input
                    type="number"
                    min="1"
                    value={currentOrder.qty}
                    onChange={(e) =>
                      setCurrentOrder({ ...currentOrder, qty: Number(e.target.value) })
                    }
                  />
                )}

                {/* Total */}
                {currentOrder.price > 0 && (
                  <div className="total-box">
                    ₹ {currentOrder.qty * currentOrder.price}
                  </div>
                )}

                {/* Add to Cart */}
                {currentOrder.price > 0 && (
                  <button className="add-btn" onClick={addToCart}>
                    Add to Cart
                  </button>
                )}

                {/* Save Order */}
                <button className="submit-btn" onClick={saveOrder}>
                  Confirm Order
                </button>
              </div>


            </div>

            <div className="recent-order-card" style={{ marginTop: "20px" }}>
              <h3>Recent Order</h3>
              <p><strong>Customer:</strong> {orders[orders.length - 1].form.name}</p>
              <p>
                <strong>Items:</strong>{" "}
                {orders[orders.length - 1].cart
                  .map(i => `${i.brand}-${i.itemType} x${i.qty}`)
                  .join(", ")}
              </p>
              <p><strong>Total:</strong> ₹ {orders[orders.length - 1].grandTotal}</p>
            </div>
          </>
        )}

        {activeView === "dashboard" && (
          <div className="insights-panel">

            <div className="insight-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

              {/* VIP CUSTOMERS LIST */}
              <div className="table-card premium-card">
                <h3 style={{ color: '#D4AF37' }}>🏆 Top VIP Customers</h3>
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Orders</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipCustomers.map(vip => (
                      <tr key={vip.id}>
                        <td>{vip.name}</td>
                        <td>{vip.orderCount}</td>
                        <td>₹{vip.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}



        {/* USERS VIEW */}
        {activeView === "users" && (
          <div className="table-card">
            <div className="customer-header-container">
              <h2 className="customer-header">
                <span>CUSTOMER</span>

                <button
                  className="add-btn"
                  onClick={() => setAddCustomerModal(true)}
                >
                  + Add Customer
                </button>
              </h2>
            </div>
            <div className="sales-table-container">
              <input
                className="search-input"
                placeholder="Search..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
              />
              <table className="sales-table">
                <thead>
                  <tr>
                    {/* Select All Checkbox */}
                    <th>
                      <input
                        type="checkbox"
                        className="modern-checkbox"
                        checked={selectedCustomers.length === users.length && users.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Select all customer IDs
                            setSelectedCustomers(users.map(u => u.id));
                          } else {
                            setSelectedCustomers([]);
                          }
                        }}
                      />
                    </th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="modern-checkbox"
                          checked={selectedCustomers.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, u.id]);
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== u.id));
                            }
                          }}
                        />

                      </td>
                      <td>{u.name}</td>
                      <td>{u.mobile}</td>
                      <td>{u.email}</td>
                      <td>{u.address}</td>

                      <td className="action-buttons">

                        <button
                          className="view-btn"
                          onClick={() => handleViewOrders(u)}
                        >
                          View Orders
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => openEditModal(u)}
                        >
                          <FaUserEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedCustomers.length > 0 && (
                <div className="send-whatsapp-container">
                  <button
                    className="send-whatsapp-btn"
                    onClick={() => setWhatsAppModal(true)}
                  >
                    Send WhatsApp
                  </button>
                </div>
              )}

            </div>
          </div>
        )}



        {/* EDIT CUSTOMER MODAL */}
        {editModal.show && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Customer</h3>
              <input
                placeholder="Customer Name"
                value={editModal.user.name}
                onChange={(e) =>
                  setEditModal({ ...editModal, user: { ...editModal.user, name: e.target.value } })
                }
              />
              <input
                placeholder="Mobile"
                value={editModal.user.mobile}
                maxLength={10}
                onChange={(e) =>
                  setEditModal({ ...editModal, user: { ...editModal.user, mobile: e.target.value } })
                }
              />
              <input
                placeholder="Email"
                value={editModal.user.email}
                onChange={(e) =>
                  setEditModal({ ...editModal, user: { ...editModal.user, email: e.target.value } })
                }
              />
              <textarea
                placeholder="Address"
                value={editModal.user.address}
                onChange={(e) =>
                  setEditModal({ ...editModal, user: { ...editModal.user, address: e.target.value } })
                }
              />
              <div className="action-buttons">
                <button className="submit-btn" onClick={handleUpdateCustomer}>
                  Update
                </button>
                <button className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {addCustomerModal && (
          <div className="modal-overlay">
            <div className="modal add-customer-modal">
              <h3>Add New Customer</h3>

              <input
                placeholder="Customer Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                placeholder="Mobile"
                maxLength={10}
                value={form.mobile}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) {
                    setForm({ ...form, mobile: e.target.value });
                  }
                }}
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <textarea
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  className="submit-btn"
                  onClick={() => {
                    saveCustomerOnly();
                    setAddCustomerModal(false);
                  }}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setAddCustomerModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {activeView === "orders" && (
          <div className="table-card">
            <div className="table-header-flex">
              <div>
                <h2>Order Management</h2>
              </div>
            </div>

            {/* 🔎 Search Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <div className="sales-table-wrapper">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Customer & Tag</th>
                    <th>Items & Fabric</th>
                    <th>Status Tracking</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders
                    // 🔎 First filter orders based on search term
                    .filter((orderItem) => {

                      // Convert search input to lowercase for case-insensitive search
                      const search = searchTerm.toLowerCase();

                      // 📛 Get customer name safely (avoid undefined error)
                      const name = orderItem.form?.name?.toLowerCase() || "";

                      // 📦 Get order status safely  //order status ley 
                      const status = orderItem.status?.toLowerCase() || "";

                      // 📅 Get raw date from order form  //date ley 
                      const rawDate = orderItem.form?.date;

                      // 📆 Format date in "DD Mon YYYY" format (Indian format)
                      const formattedDate = rawDate
                        ? new Date(rawDate)
                          .toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .toLowerCase()
                        : "";

                      // 🔍 Return true if search matches name, status or formatted date
                      return (
                        name.includes(search) ||   //find the searched name and display the searched order 
                        status.includes(search) ||  //find the searched status  and display the searched order 
                        formattedDate.includes(search)  //find the searched date  and display the searched order 
                      );
                    })

                    // 🔁 Loop through filtered orders and render them
                    .map((orderItem) => {

                      // 🧮 Calculate total quantity of items in cart
                      const totalQty =
                        orderItem.cart?.reduce(
                          (sum, i) => sum + Number(i.qty),
                          0
                        ) || 0;

                      // 📦 Check if order is bulk (5 or more items)
                      const isBulk = totalQty >= 5;

                      // 📌 Default status = Pending if no status exists
                      const currentStatus = orderItem.status || "Pending";    //status are not display then you can imagine to order is pending 

                      // 📅 Get raw date again for display
                      const rawDate = orderItem.form?.date;

                      // 📆 Format date for display
                      const formattedDate = rawDate
                        ? new Date(rawDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "No Date";


                      return (
                        <tr
                          key={orderItem.id}
                          className={isBulk ? "bulk-order-row" : ""}
                        >
                          <td>
                            <span className="date-cell">{formattedDate}</span>
                          </td>

                          <td>
                            <div className="cust-info">
                              <b>{orderItem.form?.name || "Unknown"}</b>
                              {isBulk && (
                                <span className="bulk-badge">BULK</span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="item-details">
                              {orderItem.cart?.map((i, index) => (
                                <span key={index} className="fabric-tag">
                                  {i.brand} {i.itemType} (x{i.qty})
                                </span>
                              ))}
                            </div>
                          </td>

                          <td>
                            <div className="status-timeline">
                              <select
                                className={`status-select ${currentStatus.toLowerCase()}`}
                                value={currentStatus}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    orderItem.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Pending">🕒 Pending</option>
                                <option value="Tailoring">🧵 Tailoring</option>
                                <option value="Ready">✨ Ready</option>
                                <option value="Complete">✅ Completed</option>
                              </select>

                              <div className="status-progress-bar">
                                <div
                                  className={`progress-fill ${currentStatus.toLowerCase()}`}
                                  style={{
                                    width:
                                      currentStatus === "Pending"
                                        ? "25%"
                                        : currentStatus === "Tailoring"
                                          ? "50%"
                                          : currentStatus === "Ready"
                                            ? "75%"
                                            : "100%",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          <td className="grand-total-cell">
                            ₹ {orderItem.grandTotal || 0}
                          </td>

                          <td>
                            <div className="action-icons">
                              <button
                                className="delete-btn"
                                onClick={() =>
                                  openDeleteModal(orderItem.id)
                                }
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {viewOrdersModal.show && (
          <div className="modal-overlay">
            <div className="modal view-orders-modal">
              <h3>
                Orders of {viewOrdersModal.customer.name}
                <span style={{ fontSize: "14px", color: "#666" }}>
                  {" "}({viewOrdersModal.customer.mobile})
                </span>
              </h3>

              {viewOrdersModal.orders.length === 0 ? (
                <p className="view-orders-empty">No orders found ❌</p>
              ) : (
                <>
                  <table className="view-orders-table">
                    <thead>
                      <tr>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewOrdersModal.orders.map((o) => (
                        <tr key={o.id}>
                          <td>
                            {o.cart.map(i => `${i.brand} - ${i.itemType} x${i.qty}`).join(", ")}
                          </td>
                          <td>₹ {o.grandTotal}</td>
                          <td>
                            <div className="action-buttons ">
                              <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => openEditOrderModal(o)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Horizontal line */}
                  <hr style={{ margin: "10px 0" }} />

                  {/* Total of all orders */}
                  <div className="view-orders-grand-total" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total for {viewOrdersModal.customer.name}: ₹ {viewOrdersModal.orders.reduce((sum, o) => sum + o.grandTotal, 0)}
                  </div>
                </>
              )}

              <div className="view-orders-actions">
                <button
                  className="view-orders-close"
                  onClick={() =>
                    setViewOrdersModal({
                      show: false,
                      customer: null,
                      orders: [],
                    })
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}



        {editOrderModal.show && (
          <div className="modal-overlay">
            <div className="modal edit-order-modal">
              <h3>Edit Order</h3>

              {editOrderModal.order.cart.map((item, index) => (
                <div key={index} className="edit-item-row">

                  <input
                    value={item.brand}
                    onChange={(e) =>
                      handleEditItemChange(index, "brand", e.target.value)
                    }
                    placeholder="Brand"
                  />

                  <input
                    value={item.itemType}
                    onChange={(e) =>
                      handleEditItemChange(index, "itemType", e.target.value)
                    }
                    placeholder="Item"
                  />

                  <input
                    value={item.price}
                    onChange={(e) =>
                      handleEditItemChange(index, "price", Number(e.target.value))
                    }

                  />

                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleEditItemChange(index, "qty", Number(e.target.value))
                    }
                    placeholder="Qty"
                  />

                </div>
              ))}

              <hr />

              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Grand Total: ₹ {editOrderModal.order.grandTotal}
              </div>

              <div className="action-buttons ">
                <button className="submit-btn" onClick={saveEditedOrder}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() =>
                    setEditOrderModal({ show: false, order: null })
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {activeView === "sales" && (
          <div className="sales-container">
            {/* Summary Section */}
            <div className="summary-grid">
              <div className="stat-card">
                <span className="stat-label">Total Revenue</span>
                <h3 className="stat-value">₹{totalSales.toLocaleString()}</h3>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Orders</span>
                <h3 className="stat-value">{orders.length}</h3>
              </div>
              <div className="stat-card">
                <span className="stat-label">Avg Order Value</span>
                <h3 className="stat-value">
                  ₹{orders.length ? Math.round(totalSales / orders.length).toLocaleString() : 0}
                </h3>
              </div>
            </div>

            {/* Chart Section */}
            {orders.length > 0 && (
              <div className="chart-card">
                <div className="chart-header">
                  <h2>Sales per Customer</h2>
                  <div className="gold-divider"></div>
                </div>

                <div className="chart-wrapper">
                  <Bar
                    data={{
                      labels: orders.map((o) => o.form.name.split(" ")),
                      datasets: [
                        {
                          label: "Order Value (₹)",
                          data: orders.map((o) => o.grandTotal),
                          backgroundColor: "rgba(197, 160, 89, 0.8)", 
                          hoverBackgroundColor: "#c5a059",
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { display: false }, // Mobile par space bachane ke liye hide kiya
                        tooltip: {
                          backgroundColor: '#1e293b',
                          titleFont: { size: 14 },
                          bodyFont: { size: 13 },
                          padding: 12,
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            padding: 8,
                            lineHeight: 1.1,
                            font: {
                              size: orders.length > 7 ? 7 : (window.innerWidth < 480 ? 9 : 11),
                              family: "'Inter', sans-serif"
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          grid: { color: "#f1f1f1" },
                          ticks: {
                            callback: (value) => '₹' + value,
                            font: { size: 10 }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

{activeView === "images" && (
  <div className="images-container">
    <h2>Upload Siyaram Page Images</h2>

    <div className="image-upload-box">

      {/* 🔥 Image Type Select */}
      <select
        value={imageType}
        onChange={(e) => setImageType(e.target.value)}
      >
        <option value="">Select Image Type</option>
        <option value="hero">Hero Image</option>
        <option value="slider">Slider Image</option>
        <option value="suiting">Suiting Image</option>
        <option value="shirting">Shirting Image</option>
      </select>

      {/* 🔥 Title + Brand only for Suiting / Shirting */}
      {(imageType === "suiting" || imageType === "shirting") && (
        <>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </>
      )}

      {/* 🔥 Order input only for slider */}
      {imageType === "slider" && (
        <input
          type="number"
          placeholder="Enter Image Order"
          value={imageOrder}
          onChange={(e) => setImageOrder(e.target.value)}
        />
      )}

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button
        className="submit-btn"
        onClick={handleImageUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

    </div>
  </div>
)}

        {whatsAppModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Send WhatsApp Message</h3>

              <textarea
                placeholder="Type your message here..."
                value={whatsAppText}
                onChange={(e) => setWhatsAppText(e.target.value)}
              />

              <div className="modal-actions">
                <button className="submit-btn" onClick={sendWhatsAppWeb}>
                  Send
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setWhatsAppModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {/* DELETE MODAL */}
        {deleteModal.show && (
          <div className="modal-overlay">
            <div className="modal">
              <p>Are you sure you want to delete this order?</p>
              <div className="action-buttons ">
                <button className="submit-btn" onClick={confirmDelete}>Yes</button>
                <button className="cancel-btn" onClick={cancelDelete}>No</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
