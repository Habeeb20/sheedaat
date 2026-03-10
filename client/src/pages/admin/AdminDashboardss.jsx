// // src/pages/admin/Dashboard.jsx
// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('products'); // products | services | gallery

//   // Shared states for form
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState(''); // only for products
//   const [description, setDescription] = useState(''); // only for services
//   const [mediaUrls, setMediaUrls] = useState([]); // array of secure_urls from Cloudinary
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');

//   const widgetRef = useRef(null);
//   const cloudinaryRef = useRef(null);

//   // Load Cloudinary script once
//   useEffect(() => {
//     if (!window.cloudinary) {
//       const script = document.createElement('script');
//       script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
//       script.async = true;
//       document.body.appendChild(script);

//       script.onload = () => {
//         cloudinaryRef.current = window.cloudinary;
//       };
//     } else {
//       cloudinaryRef.current = window.cloudinary;
//     }
//   }, []);

//   const openUploadWidget = () => {
//     if (!cloudinaryRef.current) {
//       alert('Cloudinary not loaded yet. Please wait.');
//       return;
//     }

//     widgetRef.current = cloudinaryRef.current.createUploadWidget(
//       {
//         cloudName: 'dc0poqt9l',
//         uploadPreset: 'essential',
//         sources: ['local', 'url', 'camera'], // allow local files, URLs, camera
//         multiple: true,
//         maxFiles: 10,
//         resourceType: 'auto', // auto detect image/video
//         clientAllowedFormats: ['png', 'jpg', 'jpeg', 'mp4', 'mov', 'webp'],
//         maxFileSize: 10485760, // 10MB limit (adjust if needed)
//         folder: 'admin-uploads', // optional: organize in folder
//       },
//       (error, result) => {
//         if (!error && result && result.event === 'success') {
//           const url = result.info.secure_url;
//           setMediaUrls((prev) => [...prev, url]);
//           console.log('Uploaded:', url);
//         }

//         if (error) {
//           console.error('Upload Widget error:', error);
//         }
//       }
//     );

//     widgetRef.current.open();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMsg('');
//     setErrorMsg('');
//     setLoading(true);

//     if (mediaUrls.length === 0) {
//       setErrorMsg('Please upload at least one media file');
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       name,
//       media: mediaUrls,
//     };

//     if (activeTab === 'products') {
//       payload.price = Number(price);
//     } else if (activeTab === 'services') {
//       payload.description = description;
//     }

//     try {
//       let endpoint = '';
//       if (activeTab === 'products') endpoint = '/api/admin/products';
//       else if (activeTab === 'services') endpoint = '/api/admin/services';
//       else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
//           },
//         }
//       );

//       setSuccessMsg(`${activeTab.slice(0, -1)} created successfully!`);
//       // Reset form
//       setName('');
//       setPrice('');
//       setDescription('');
//       setMediaUrls([]);
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || 'Failed to create item');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeMedia = (index) => {
//     setMediaUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

//       <div className="flex gap-4 mb-8">
//         <button
//           onClick={() => setActiveTab('products')}
//           className={`px-6 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Add Product
//         </button>
//         <button
//           onClick={() => setActiveTab('services')}
//           className={`px-6 py-2 rounded ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Add Service
//         </button>
//         <button
//           onClick={() => setActiveTab('gallery')}
//           className={`px-6 py-2 rounded ${activeTab === 'gallery' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Add Gallery Item
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
//         <h3 className="text-xl font-semibold mb-4">
//           Create New {activeTab === 'products' ? 'Product' : activeTab === 'services' ? 'Service' : 'Gallery Item'}
//         </h3>

//         {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
//         {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-2 border rounded"
//             required
//           />
//         </div>

//         {activeTab === 'products' && (
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Price (₦)</label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full px-4 py-2 border rounded"
//               min="0"
//               required
//             />
//           </div>
//         )}

//         {activeTab === 'services' && (
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-2 border rounded h-32"
//               required
//             />
//           </div>
//         )}

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Media (Images/Videos)</label>
//           <button
//             type="button"
//             onClick={openUploadWidget}
//             className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-3"
//           >
//             Upload Media
//           </button>

//           <div className="flex flex-wrap gap-3">
//             {mediaUrls.map((url, idx) => (
//               <div key={idx} className="relative">
//                 {url.endsWith('.mp4') || url.endsWith('.mov') ? (
//                   <video src={url} className="w-32 h-32 object-cover rounded" controls />
//                 ) : (
//                   <img src={url} alt="preview" className="w-32 h-32 object-cover rounded" />
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => removeMedia(idx)}
//                   className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>

//           {mediaUrls.length === 0 && <p className="text-gray-500 mt-2">No media uploaded yet</p>}
//         </div>

//         <button
//           type="submit"
//           disabled={loading || mediaUrls.length === 0}
//           className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? 'Creating...' : 'Create'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminDashboard;









// src/pages/admin/Dashboard.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // products | services | gallery
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);

  const widgetRef = useRef(null);
  const cloudinaryRef = useRef(null);

  // Load Cloudinary script
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/latest/global/all.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
      };
    } else {
      cloudinaryRef.current = window.cloudinary;
    }
  }, []);

  // Fetch items when tab changes
  useEffect(() => {
    fetchItems();
    // Reset form when switching tabs
    resetForm();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = '/api/admin/products';
      else if (activeTab === 'services') endpoint = '/api/admin/services';
      else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setItems(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const openUploadWidget = () => {
    if (!cloudinaryRef.current) {
      alert('Cloudinary widget not loaded yet. Please wait a moment.');
      return;
    }

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: 'dc0poqt9l',
        uploadPreset: 'essential',
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        resourceType: 'auto',
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'mp4', 'mov', 'webp'],
        maxFileSize: 10485760, // 10MB
        folder: 'admin-uploads',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setMediaUrls((prev) => [...prev, result.info.secure_url]);
        }
        if (error) console.error('Upload error:', error);
      }
    );
    widgetRef.current.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setFormLoading(true);

    if (mediaUrls.length === 0) {
      setErrorMsg('Please upload at least one media file');
      setFormLoading(false);
      return;
    }

    const payload = { name, media: mediaUrls };
    if (activeTab === 'products') payload.price = Number(price);
    if (activeTab === 'services') payload.description = description;

    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = '/api/admin/products';
      else if (activeTab === 'services') endpoint = '/api/admin/services';
      else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}${endpoint}/${editId}`,
          payload,
          config
        );
        setSuccessMsg(`${activeTab.slice(0, -1)} updated successfully!`);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, payload, config);
        setSuccessMsg(`${activeTab.slice(0, -1)} created successfully!`);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || (isEditing ? 'Update failed' : 'Creation failed'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setName(item.name);
    setMediaUrls(item.media || []);
    if (activeTab === 'products') setPrice(item.price || '');
    if (activeTab === 'services') setDescription(item.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = '/api/admin/products';
      else if (activeTab === 'services') endpoint = '/api/admin/services';
      else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });

      setSuccessMsg(`${activeTab.slice(0, -1)} deleted successfully`);
      fetchItems();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName('');
    setPrice('');
    setDescription('');
    setMediaUrls([]);
  };

  const removeMedia = (index) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200">
          {['products', 'services', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {isEditing ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {activeTab === 'products' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  min="0"
                  required
                />
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media (Images / Videos)</label>
              <button
                type="button"
                onClick={openUploadWidget}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-md mb-4"
              >
                Upload Media
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    {url.match(/\.(mp4|mov)$/i) ? (
                      <video
                        src={url}
                        className="w-full h-32 object-cover rounded-lg shadow"
                        controls
                      />
                    ) : (
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg shadow"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {mediaUrls.length === 0 && (
                <p className="text-gray-500 mt-3 text-sm">No media uploaded yet</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={formLoading || mediaUrls.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 font-medium shadow-md"
              >
                {formLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No {activeTab} found. Create your first one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    {activeTab === 'products' && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    )}
                    {activeTab === 'services' && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {item.media?.slice(0, 3).map((url, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              {url.match(/\.(mp4|mov)$/i) ? (
                                <video src={url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={url} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                          ))}
                          {item.media?.length > 3 && (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border-2 border-white">
                              +{item.media.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      {activeTab === 'products' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₦{Number(item.price).toLocaleString()}</div>
                        </td>
                      )}
                      {activeTab === 'services' && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {item.description}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;