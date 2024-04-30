const { Schedule } = require("../dbconfig");

const getTime_slot = () => {
    const time_slot = [];
    for (i = 8; i <= 13; i++) {
        time_slot.push({ time: `${i}:00`});
    }   
    return time_slot; 
}
const checkValidDates = async (dates, userId) => {
    const invalid = [];
    const valid = []
    const validDates = await Promise.all(dates.map(async (element) => {
        const existDate = await Schedule.findOne({
            doctor: userId, 
            'schedule.date': element.date
        });
        existDate ? invalid.push(element) : valid.push(element)
        return !existDate ? element : null;
    }));
    const dateObject = {
        invalid,
        valid
    }
    const results = validDates.filter(element => element !== null);
    return dateObject;
}
const doctorSchedule = async (start, end, user) => {
                // this is what i get in the body
            const startDate = new Date(start), endDate = new Date(end);
            const time_slot = getTime_slot();
            
            const dateSlot = []
            const current = new Date(startDate);
            while (current <= endDate) {
                if (current.getDay() !== 6 && current.getDay() !== 0) {
                        dateSlot.push({
                            date: new Date(current),
                            time_slot,    
                        });
                } 
                current.setDate(current.getDate() + 1)
            }
            const doctorDates = await Schedule.findOne({doctor: user})
            const objectData = { userScheduleExist: false }
            if (!doctorDates) {
                objectData.invalid = []
                objectData.valid = dateSlot;
                return objectData
            }

            const validDates = await checkValidDates(dateSlot, user);
            validDates.userScheduleExist = true
            return validDates; 
};
module.exports = doctorSchedule;