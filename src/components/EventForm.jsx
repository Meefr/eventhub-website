// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import {
//   getEvent,
//   createEvent,
//   updateEvent,
//   getEventCategories,
//   uploadEventImage, // Import the image upload function (you'll need to create this)
// } from "../services/eventService";
// import { useAuth } from "../contexts/AuthContext";
// import LoadingSpinner from "./common/LoadingSpinner";
// import Button from "./common/Button";
// import Alert from "./common/Alert";
// import FormInput from "./common/FormInput";
// import FormTextarea from "./common/FormTextarea";
// import FormSelect from "./common/FormSelect";

// const EventForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(!!id);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const fileInputRef = useRef(null);

//   const [event, setEvent] = useState({
//     title: "",
//     description: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     location: "",
//     capacity: 1,
//     price: 0,
//     category: "",
//     isFeatured: false,
//     isPublished: false,
//     image: "", // Add image field to store the uploaded image URL
//   });

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await getEventCategories();
//         setCategories(data);
//       } catch (error) {
//         console.error("Error fetching event categories:", error);
//         setError(t("admin.events.fetch_categories_error"));
//       }
//     };

//     fetchCategories();

//     if (id) {
//       const fetchEvent = async () => {
//         try {
//           setLoading(true);
//           const { data } = await getEvent(id);
//           setEvent({
//             title: data.title,
//             description: data.description,
//             date: data.date.split("T")[0],
//             startTime: data.startTime ? data.startTime.slice(0, 5) : "",
//             endTime: data.endTime ? data.endTime.slice(0, 5) : "",
//             location: data.location || "",
//             capacity: data.capacity || data.availableTickets || 1,
//             price: data.price,
//             category: data.category?._id || "",
//             isFeatured: data.isFeatured,
//             isPublished: data.isPublished,
//             image: data.image || "",
//           });

//           // Set image preview if exists
//           if (data.image) {
//             setImagePreview(data.image);
//           }
//         } catch (error) {
//           console.error("Error fetching event:", error);
//           setError(t("admin.events.fetch_error"));
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchEvent();
//     }
//   }, [id, t]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEvent((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Handle image file selection
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Check file type
//     if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
//       setError(t("admin.events.invalid_image_type"));
//       return;
//     }

//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setError(t("admin.events.image_too_large"));
//       return;
//     }

//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setImagePreview(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handle image upload
//   const handleImageUpload = async () => {
//     if (!fileInputRef.current.files[0]) {
//       return;
//     }

//     setUploadingImage(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("image", fileInputRef.current.files[0]);

//       // const { data } = await uploadEventImage(formData);

//       setEvent((prev) => ({
//         ...prev,
//         image: fileInputRef.current.files[0],
//       }));

//       setSuccess(t("admin.events.image_upload_success"));
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setError(t("admin.events.image_upload_error"));
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   // Remove image
//   const handleRemoveImage = () => {
//     setImagePreview(null);
//     setEvent((prev) => ({
//       ...prev,
//       image: "",
//     }));
//     // Reset file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       const eventData = {
//         title: event.title,
//         description: event.description,
//         date: event.date,
//         startTime: event.startTime,
//         endTime: event.endTime,
//         location: event.location,
//         capacity: Number(event.capacity),
//         price: Number(event.price),
//         category: event.category,
//         organizer: user.id,
//         isFeatured: event.isFeatured,
//         isPublished: event.isPublished,
//         image: event.image, // Include image URL in the data
//       };

//       if (id) {
//         await updateEvent(id, eventData);
//         setSuccess(t("admin.events.update_success"));
//       } else {
//         await createEvent(eventData);
//         setSuccess(t("admin.events.create_success"));
//       }

//       setTimeout(() => {
//         navigate("/admin/events");
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving event:", error);
//       setError(error.response?.data?.message || t("admin.events.save_error"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Get current language
//   const currentLanguage = i18n.language || "en";

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">
//         {id ? t("admin.events.edit_event") : t("admin.events.add_event")}
//       </h1>

//       {error && (
//         <Alert type="error" message={error} onClose={() => setError("")} />
//       )}
//       {success && (
//         <Alert
//           type="success"
//           message={success}
//           onClose={() => setSuccess("")}
//         />
//       )}

//       <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
//         <FormInput
//           label={t("admin.events.title")}
//           name="title"
//           value={event.title}
//           onChange={handleChange}
//           required
//         />

//         <FormTextarea
//           label={t("admin.events.description")}
//           name="description"
//           value={event.description}
//           onChange={handleChange}
//           required
//           rows={4}
//         />

//         {/* Image Upload Section */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             {t("admin.events.event_image")}
//           </label>

//           {imagePreview && (
//             <div className="relative w-full h-48 mb-4">
//               <img
//                 src={imagePreview}
//                 alt="Event preview"
//                 className="w-full h-full object-cover rounded-lg"
//               />
//               <button
//                 type="button"
//                 onClick={handleRemoveImage}
//                 className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
//                 title={t("common.remove")}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
//           )}

//           <div className="flex items-center space-x-4">
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={handleImageChange}
//               ref={fileInputRef}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             <Button
//               type="button"
//               onClick={handleImageUpload}
//               loading={uploadingImage}
//               disabled={!fileInputRef?.current?.files?.[0]}
//             >
//               {t("common.upload")}
//             </Button>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">
//             {t("admin.events.image_help_text")}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput
//             label={t("admin.events.date")}
//             name="date"
//             type="date"
//             value={event.date}
//             onChange={handleChange}
//             required
//           />
//           <FormInput
//             label={t("admin.events.start_time")}
//             name="startTime"
//             type="time"
//             value={event.startTime}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormInput
//             label={t("admin.events.end_time")}
//             name="endTime"
//             type="time"
//             value={event.endTime}
//             onChange={handleChange}
//             required
//           />
//           <FormInput
//             label={t("admin.events.location")}
//             name="location"
//             value={event.location}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <FormInput
//           label={t("admin.events.capacity")}
//           name="capacity"
//           type="number"
//           min="1"
//           value={event.capacity}
//           onChange={handleChange}
//           required
//         />

//         <FormInput
//           label={t("admin.events.price")}
//           name="price"
//           type="number"
//           min="0"
//           step="0.01"
//           value={event.price}
//           onChange={handleChange}
//           required
//         />

//         <FormSelect
//           label={t("admin.events.category")}
//           name="category"
//           value={event.category}
//           onChange={handleChange}
//           options={categories.map((cat) => ({
//             value: cat._id,
//             label:
//               cat.translations?.[currentLanguage]?.name ||
//               cat.translations?.en?.name ||
//               cat.name,
//           }))}
//           required
//         />

//         {/* Button to navigate to create category page */}
//         <div className="mb-4">
//           <Link
//             to="/admin/categories/create"
//             className="text-blue-500 hover:underline"
//           >
//             {t("admin.categories.add_new_category")}
//           </Link>
//         </div>

//         <div className="flex space-x-4">
//           <div className="flex items-center">
//             <input
//               id="isFeatured"
//               name="isFeatured"
//               type="checkbox"
//               checked={event.isFeatured}
//               onChange={handleChange}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label
//               htmlFor="isFeatured"
//               className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
//             >
//               {t("admin.events.featured")}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="isPublished"
//               name="isPublished"
//               type="checkbox"
//               checked={event.isPublished}
//               onChange={handleChange}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label
//               htmlFor="isPublished"
//               className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
//             >
//               {t("admin.events.published")}
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3 pt-4">
//           <Button
//             type="button"
//             variant="secondary"
//             onClick={() => navigate("/admin/events")}
//             disabled={submitting}
//           >
//             {t("common.cancel")}
//           </Button>
//           <Button type="submit" loading={submitting}>
//             {id ? t("common.update") : t("common.create")}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EventForm;

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getEvent,
  createEvent,
  updateEvent,
  getEventCategories,
} from "../services/eventService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./common/LoadingSpinner";
import Button from "./common/Button";
import Alert from "./common/Alert";
import FormInput from "./common/FormInput";
import FormTextarea from "./common/FormTextarea";
import FormSelect from "./common/FormSelect";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 1,
    price: 0,
    category: "",
    isFeatured: false,
    isPublished: false,
    image: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getEventCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching event categories:", error);
        setError(t("admin.events.fetch_categories_error"));
      }
    };

    fetchCategories();

    if (id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const { data } = await getEvent(id);
          setEvent({
            title: data.title,
            description: data.description,
            date: data.date.split("T")[0],
            startTime: data.startTime ? data.startTime.slice(0, 5) : "",
            endTime: data.endTime ? data.endTime.slice(0, 5) : "",
            location: data.location || "",
            capacity: data.capacity || data.availableTickets || 1,
            price: data.price,
            category: data.category?._id || "",
            isFeatured: data.isFeatured,
            isPublished: data.isPublished,
            image: data.image || "",
          });

          // Set image preview if exists
          if (data.image) {
            setImagePreview(data.image);
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          setError(t("admin.events.fetch_error"));
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id, t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setError(t("admin.events.invalid_image_type"));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t("admin.events.image_too_large"));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setEvent((prev) => ({
      ...prev,
      image: "",
    }));
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSubmitting(true);
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const formData = new FormData();

  //     // Append all event data
  //     Object.keys(event).forEach(key => {
  //       // Skip image as we'll handle it separately
  //       if (key !== 'image') {
  //         formData.append(key, event[key]);
  //       }
  //     });

  //     // Append image file if exists
  //     if (imageFile) {
  //       formData.append('image', imageFile);
  //     }

  //     let response;
  //     if (id) {
  //       response = await updateEvent(id, formData);
  //       setSuccess(t("admin.events.update_success"));
  //     } else {
  //       response = await createEvent(formData);
  //       setSuccess(t("admin.events.create_success"));
  //     }

  //     setTimeout(() => {
  //       navigate("/admin/events");
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error saving event:", error);
  //     setError(error.response?.data?.message || t("admin.events.save_error"));
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // Append all event data
      Object.keys(event).forEach((key) => {
        // Skip image as we'll handle it separately
        if (key !== "image") {
          formData.append(key, event[key]);
        }
      });

      // Append image file if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let response;
      if (id) {
        response = await updateEvent(id, formData);
        setSuccess(t("admin.events.update_success"));
      } else {
        response = await createEvent(formData);
        setSuccess(t("admin.events.create_success"));
      }

      setTimeout(() => {
        navigate("/admin/events");
      }, 1500);
    } catch (error) {
      console.error("Error saving event:", error);
      setError(error.response?.data?.message || t("admin.events.save_error"));
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  // Get current language
  const currentLanguage = i18n.language || "en";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id ? t("admin.events.edit_event") : t("admin.events.add_event")}
      </h1>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <FormInput
          label={t("admin.events.title")}
          name="title"
          value={event.title}
          onChange={handleChange}
          required
        />

        <FormTextarea
          label={t("admin.events.description")}
          name="description"
          value={event.description}
          onChange={handleChange}
          required
          rows={4}
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("admin.events.event_image")}
          </label>

          {imagePreview && (
            <div className="relative w-full h-48 mb-4">
              <img
                src={imagePreview}
                alt="Event preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                title={t("common.remove")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t("admin.events.image_help_text")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t("admin.events.date")}
            name="date"
            type="date"
            value={event.date}
            onChange={handleChange}
            required
          />
          <FormInput
            label={t("admin.events.start_time")}
            name="startTime"
            type="time"
            value={event.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t("admin.events.end_time")}
            name="endTime"
            type="time"
            value={event.endTime}
            onChange={handleChange}
            required
          />
          <FormInput
            label={t("admin.events.location")}
            name="location"
            value={event.location}
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          label={t("admin.events.capacity")}
          name="capacity"
          type="number"
          min="1"
          value={event.capacity}
          onChange={handleChange}
          required
        />

        <FormInput
          label={t("admin.events.price")}
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={event.price}
          onChange={handleChange}
          required
        />

        <FormSelect
          label={t("admin.events.category")}
          name="category"
          value={event.category}
          onChange={handleChange}
          options={categories.map((cat) => ({
            value: cat._id,
            label:
              cat.translations?.[currentLanguage]?.name ||
              cat.translations?.en?.name ||
              cat.name,
          }))}
          required
        />

        {/* Button to navigate to create category page */}
        <div className="mb-4">
          <Link
            to="/admin/categories/create"
            className="text-blue-500 hover:underline"
          >
            {t("admin.categories.add_new_category")}
          </Link>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={event.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isFeatured"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {t("admin.events.featured")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={event.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              {t("admin.events.published")}
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/events")}
            disabled={submitting}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" loading={submitting}>
            {id ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
