

// // src/pages/admin/Dashboard.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('products'); // products | services | gallery
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');

//   // Form states
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedFiles, setSelectedFiles] = useState([]); // Stores actual File objects

//   // Fetch items when tab changes
//   useEffect(() => {
//     fetchItems();
//     resetForm();
//   }, [activeTab]);

//   const fetchItems = async () => {
//     setLoading(true);
//     setErrorMsg('');
//     try {
//       let endpoint = '';
//       if (activeTab === 'products') endpoint = '/api/admin/products';
//       else if (activeTab === 'services') endpoint = '/api/admin/services';
//       else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

//       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setItems(res.data);
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || 'Failed to load items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
//   };

//   const removeFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMsg('');
//     setErrorMsg('');
//     setFormLoading(true);

//     if (selectedFiles.length === 0) {
//       setErrorMsg('Please select at least one image or video');
//       setFormLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', name);

//     if (activeTab === 'products') {
//       formData.append('price', price);
//     }
//     if (activeTab === 'services') {
//       formData.append('description', description);
//     }

//     // Append all selected files (key must match multer: 'media')
//     selectedFiles.forEach((file) => {
//       formData.append('media', file);
//     });

//     try {
//       let endpoint = '';
//       if (activeTab === 'products') endpoint = '/api/admin/products';
//       else if (activeTab === 'services') endpoint = '/api/admin/services';
//       else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

//       const config = {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       };

//       if (isEditing) {
//         await axios.put(
//           `${import.meta.env.VITE_BACKEND_URL}${endpoint}/${editId}`,
//           formData,
//           config
//         );
//         setSuccessMsg(`${activeTab.slice(0, -1)} updated successfully!`);
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
//           formData,
//           config
//         );
//         setSuccessMsg(`${activeTab.slice(0, -1)} created successfully!`);
//       }

//       resetForm();
//       fetchItems();
//     } catch (err) {
//       console.error('Submit error:', err);
//       setErrorMsg(err.response?.data?.message || (isEditing ? 'Update failed' : 'Creation failed'));
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setIsEditing(true);
//     setEditId(item._id);
//     setName(item.name || '');
//     if (activeTab === 'products') setPrice(item.price || '');
//     if (activeTab === 'services') setDescription(item.description || '');
    
//     // Note: For editing, we don't pre-load files (since files can't be pre-filled easily)
//     // User must re-upload if they want to change media
//     setSelectedFiles([]);
    
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

//     try {
//       let endpoint = '';
//       if (activeTab === 'products') endpoint = '/api/admin/products';
//       else if (activeTab === 'services') endpoint = '/api/admin/services';
//       else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

//       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}${endpoint}/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });

//       setSuccessMsg(`${activeTab.slice(0, -1)} deleted successfully`);
//       fetchItems();
//     } catch (err) {
//       setErrorMsg(err.response?.data?.message || 'Delete failed');
//     }
//   };

//   const resetForm = () => {
//     setIsEditing(false);
//     setEditId(null);
//     setName('');
//     setPrice('');
//     setDescription('');
//     setSelectedFiles([]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200">
//           {['products', 'services', 'gallery'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
//                 activeTab === tab
//                   ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Messages */}
//         {successMsg && (
//           <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
//             {successMsg}
//           </div>
//         )}
//         {errorMsg && (
//           <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
//             {errorMsg}
//           </div>
//         )}

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
//           <h2 className="text-2xl font-semibold mb-6">
//             {isEditing ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                 required
//               />
//             </div>

//             {/* Price for Products */}
//             {activeTab === 'products' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   min="0"
//                   required
//                 />
//               </div>
//             )}

//             {/* Description for Services */}
//             {activeTab === 'services' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={4}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//             )}

//             {/* Media Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Media (Images / Videos) — Max 10 files
//               </label>
              
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*,video/*"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 
//                            file:mr-4 file:py-3 file:px-6 file:rounded-lg 
//                            file:border-0 file:text-sm file:font-medium 
//                            file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
//               />

//               {/* Preview Selected Files */}
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
//                 {selectedFiles.map((file, idx) => (
//                   <div key={idx} className="relative group">
//                     {file.type.startsWith('video/') ? (
//                       <video
//                         src={URL.createObjectURL(file)}
//                         className="w-full h-32 object-cover rounded-lg shadow"
//                         controls
//                       />
//                     ) : (
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt="preview"
//                         className="w-full h-32 object-cover rounded-lg shadow"
//                       />
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => removeFile(idx)}
//                       className="absolute top-2 right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {selectedFiles.length === 0 && (
//                 <p className="text-gray-500 mt-3 text-sm">No files selected yet</p>
//               )}
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="submit"
//                 disabled={formLoading || selectedFiles.length === 0}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 font-medium shadow-md"
//               >
//                 {formLoading ? 'Uploading & Saving...' : isEditing ? 'Update' : 'Create'}
//               </button>

//               {isEditing && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Items List - Unchanged */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-semibold">
//               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List
//             </h2>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
//             </div>
//           ) : items.length === 0 ? (
//             <div className="p-12 text-center text-gray-500">
//               No {activeTab} found. Create your first one above!
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     {activeTab === 'products' && (
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                     )}
//                     {activeTab === 'services' && (
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                     )}
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {items.map((item) => (
//                     <tr key={item._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex -space-x-2">
//                           {item.media?.slice(0, 3).map((url, i) => (
//                             <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
//                               {url.match(/\.(mp4|mov)$/i) ? (
//                                 <video src={url} className="w-full h-full object-cover" />
//                               ) : (
//                                 <img src={url} alt="" className="w-full h-full object-cover" />
//                               )}
//                             </div>
//                           ))}
//                           {item.media?.length > 3 && (
//                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border-2 border-white">
//                               +{item.media.length - 3}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{item.name}</div>
//                       </td>
//                       {activeTab === 'products' && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">₦{Number(item.price).toLocaleString()}</div>
//                         </td>
//                       )}
//                       {activeTab === 'services' && (
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
//                             {item.description}
//                           </div>
//                         </td>
//                       )}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="text-indigo-600 hover:text-indigo-900 mr-4 transition"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(item._id)}
//                           className="text-red-600 hover:text-red-900 transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;











// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
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
  const [selectedFiles, setSelectedFiles] = useState([]); // Holds multiple File objects

  // Fetch items when tab changes
  useEffect(() => {
    fetchItems();
    resetForm();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = '/api/admin/products';
      else if (activeTab === 'services') endpoint = '/api/admin/services';
      else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setItems(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Handle multiple file selection (append new files)
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove a specific file from selection
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setFormLoading(true);

    if (selectedFiles.length === 0) {
      setErrorMsg('Please select at least one image or video');
      setFormLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);

    if (activeTab === 'products') {
      formData.append('price', price);
    }
    if (activeTab === 'services') {
      formData.append('description', description);
    }

    // Append ALL selected files under the key 'media' (must match multer)
    selectedFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      let endpoint = '';
      if (activeTab === 'products') endpoint = '/api/admin/products';
      else if (activeTab === 'services') endpoint = '/api/admin/services';
      else if (activeTab === 'gallery') endpoint = '/api/admin/gallery';

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}${endpoint}/${editId}`,
          formData,
          config
        );
        setSuccessMsg(`${activeTab.slice(0, -1)} updated successfully!`);
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
          formData,
          config
        );
        setSuccessMsg(`${activeTab.slice(0, -1)} created successfully!`);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.response?.data?.message || (isEditing ? 'Update failed' : 'Creation failed'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setName(item.name || '');
    if (activeTab === 'products') setPrice(item.price || '');
    if (activeTab === 'services') setDescription(item.description || '');

    // When editing, clear previous file selection (user must re-upload if needed)
    setSelectedFiles([]);
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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    setSelectedFiles([]);
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
            {/* Name */}
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

            {/* Price for Products */}
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

            {/* Description for Services */}
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

            {/* Multiple Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media (Images / Videos) — Select multiple files
              </label>

              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 
                           file:mr-4 file:py-3 file:px-6 file:rounded-lg 
                           file:border-0 file:text-sm file:font-medium 
                           file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />

              {/* Preview Selected Files */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    {file.type.startsWith('video/') ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-32 object-cover rounded-lg shadow"
                        controls
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg shadow"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {selectedFiles.length > 0 && (
                <p className="text-blue-600 text-sm mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
              {selectedFiles.length === 0 && (
                <p className="text-gray-500 mt-3 text-sm">No files selected yet</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={formLoading || selectedFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 font-medium shadow-md"
              >
                {formLoading ? 'Uploading & Saving...' : isEditing ? 'Update' : 'Create'}
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    {activeTab === 'products' && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    )}
                    {activeTab === 'services' && (
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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