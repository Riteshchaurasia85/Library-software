  if (page === "birthday") {
        try {
            // Get all students from database
            let allStudents = await Student.find();

            // Get today's date (month and day)
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            // Filter students whose birthday is today
            const birthdayStudents = allStudents.filter((student) => {
                const dob = new Date(student.dateOfBirth);
                const dobMonth = dob.getMonth() + 1;
                const dobDay = dob.getDate();
                return dobMonth === currentMonth && dobDay === currentDay;
            });

            return res.render("index", {
                activePage: page,
                content: "pages/birthday",
                pageTitle: title,
                birthdayStudents,
                currentDate: today.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
        } catch (error) {
            console.error("Failed to load birthdays:", error);
            return res.render("index", {
                activePage: page,
                content: "pages/placeholder",
                pageTitle: title,
                pageDescription: "Birthday data failed to load. Please try again later."
            });
        }
    }