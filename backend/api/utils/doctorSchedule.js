const getTime_slot = () => {
    const time_slot = [];
    for (i = 8; i <= 13; i++) {
        time_slot.push({ time: `${i}:00`});
    }   
    return time_slot; 
}
const getValidDates = startDate => {
    
    const validDates = []
    const time_slot = getTime_slot();
    const current = new Date(startDate);
 
    while (current.getUTCMonth() == startDate.getUTCMonth()) {
        if (current.getUTCDay() != 0 && current.getUTCDay() != 6) {
            validDates.push({
                date: new Date(current),
                time_slot,
            })
        }
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return validDates
}
module.exports = getValidDates;