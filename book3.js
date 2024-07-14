var firebaseConfig = {
    apiKey: "AIzaSyCERgwujpAy-Lw5sR6qUapY-bjJPQE8AjU",
    authDomain: "bookdetail01.firebaseapp.com",
    projectId: "bookdetail01",
    storageBucket: "bookdetail01.appspot.com",
    messagingSenderId: "721795220776",
    appId: "1:721795220776:web:b956f9ed18339fa7c3fc1d"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Variable to access database
const studentListRef = firestore.collection("TheStudentList");

// Get Submit Form
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Form values
  const formData = getFormData();

  try {
    // Start a Firestore transaction
    const transaction = await firestore.runTransaction(async (transaction) => {
      // Check for existing student with the same ID
      const studentRef = studentListRef.doc(formData.studentId);
      const studentSnapshot = await transaction.get(studentRef);
  
      if (studentSnapshot.exists) {
        console.log("Student with ID", formData.studentId, "already exists. No update performed.");
        showToast("Student with the same ID already exists!", "top", "info");
        throw new Error("Student with the same ID already exists!"); // Throw an error to prevent data from being saved
      } else {
        // Student doesn't exist, proceed with adding new data
        const newStudentRef = studentListRef.doc(formData.studentId); // Use the student ID as the document ID
        await transaction.set(newStudentRef, formData);
        console.log("Student data saved successfully!");
        showToast("Student Added Successfully!", "top", "success");
        clearForm(); // Clear form only if transaction is successful
      }
    });
  } catch (error) {
    console.error("Error saving student data:", error.message);
    showToast("Error adding student! " + error.message, "top", "error");
  }
});

//  function to get form data
function getFormData() {
  return {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    studentId: document.getElementById("studentId").value,
    degree: document.getElementById("degree").value,
    department: document.getElementById("department").value,
    year: document.getElementById("year").value,
    cgpa: document.getElementById("cgpa").value,
    preferredDate: document.getElementById("preferredDate").value,
    mode: document.getElementById("mode").value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
}

// Function for toast messages
function showToast(message, position, type) {
  const toast = document.getElementById("toast");
  toast.className = toast.className + " show";

  if (message) toast.innerText = message;

  if (position !== "") toast.className = toast.className + ` ${position}`;
  if (type !== "") toast.className = toast.className + ` ${type}`;

  setTimeout(function () {
    toast.className = toast.className.replace(" show", "");
  }, 5000);
}

//Function to clear form
function clearForm() {
  document.getElementById("booking-form").reset();
}  
  
  
