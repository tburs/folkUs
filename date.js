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
const db = firestore; // Define db variable


async function init() {
// Get the user ID from the query parameter
const userId = new URLSearchParams(window.location.search).get('userId');
if (!userId) {
  console.error('Error: userId not found in query parameter');
  return;
}

// Get the form elements
const dateElement = document.getElementById('datepicker');
const timeElement = document.getElementById('timepicker');
if (!dateElement || !timeElement) {
  console.error('Error: date or time elements not found in HTML');
  return;
}

// Submitting
document.getElementById("submit").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent default form submission

  const dateValue = dateElement.value;
  const timeValue = timeElement.value;
  if (!dateValue || !timeValue) {
    console.error('Error: date or time values are empty');
    return;
  }

  const formData = {
    startTime: dateValue,
    endTime: timeValue,
    
  };

  try {
    // Create a subcollection within the user document
    const docRef = await db.collection('TheStudentList').doc(userId).collection('interviewSlots').add(formData);
    console.log(`Subcollection document created: ${docRef.id}`);
    //showToast("Slot Added Successfully!", "top", "success");
    

    // Update the user document with a reference to the new subcollection document
    await db.collection('TheStudentList').doc(userId).update({
      interviewSlots: firebase.firestore.FieldValue.arrayUnion(docRef.id)
    });
  } catch (error) {
    console.error('Error creating subcollection document or updating user document:', error);
  }
});
}
init()



  



let bookedTimeSlots = {};

//console.log('Retrieving documents from TheStudentList collection...');
db.collection('TheStudentList').get().then(querySnapshot => {
  //console.log(`Retrieved ${querySnapshot.docs.length} documents from TheStudentList collection.`);
  const promises = querySnapshot.docs.map(doc => {
    //console.log(`Processing document ${doc.id} from TheStudentList collection...`);
    const interviewSlotsRef = doc.ref.collection('interviewSlots');
    return interviewSlotsRef.get().then(subquerySnapshot => {
      //console.log(`Retrieved ${subquerySnapshot.docs.length} documents from interviewSlots subcollection of document ${doc.id}.`);
      subquerySnapshot.docs.forEach(subdoc => {
        //console.log(`Processing document ${subdoc.id} from interviewSlots subcollection...`);
        const startTime = subdoc.data().startTime; // "22-07-2024"
        const endTime = subdoc.data().endTime; // "09:00"
        const dateParts = startTime?.split('-'); // Use optional chaining operator
        if (dateParts) {
          const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to "2024-07-22" format
          //console.log(`Processing start time ${startTime} and end time ${endTime}...`);
          if (!bookedTimeSlots[date]) {
            bookedTimeSlots[date] = [];
          }
          bookedTimeSlots[date].push(endTime);
          //console.log(`Added end time ${endTime} to booked time slots for date ${date}.`);
        }
      });
    });
  });
  return Promise.all(promises);
}).then(() => {
  console.log('Finished processing all documents and subcollections.');
  console.log('Booked time slots:');
  console.log(bookedTimeSlots);
  // now getting the empty slots
const totalAvailableTimeSlots = {};
for (let date = new Date('2024-07-12'); date <= new Date('2024-07-22'); date.setDate(date.getDate() + 1)) {
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  totalAvailableTimeSlots[dateString] = [];
  for (let hour = 9; hour <= 15; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      totalAvailableTimeSlots[dateString].push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
}
console.log(" total slots");
console.log(totalAvailableTimeSlots);



const emptySlots = {};

Object.keys(totalAvailableTimeSlots).forEach(date => {
  //console.log(`Processing date: ${date}`);
  const availableSlots = totalAvailableTimeSlots[date];
  //console.log(`Available slots for ${date}: ${availableSlots}`);
  const bookedSlot = bookedTimeSlots[date] || [];
  //console.log(`Booked slots for ${date}: ${bookedSlot}`);
  const formattedBookedSlot = bookedSlot.map(time => `${date} ${time}`);
  //console.log(`Formatted booked slots for ${date}: ${formattedBookedSlot}`);
  const emptySlot = availableSlots.filter(slot =>!formattedBookedSlot.includes(`${date} ${slot}`));
  //console.log(`Empty slots for ${date}: ${emptySlot}`);
  if (emptySlot.length > 0) {
    emptySlots[date] = emptySlot;
    console.log('emptySlot');
    console.log(emptySlot);
  }
});


});





