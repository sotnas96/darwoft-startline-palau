const { MedicalArea } = require("../dbconfig");
const getMedicAreas = async () => {
    try {
        return await MedicalArea.find({}); //it returns an array;
    } catch(error) {
        res.status(400).json({error: error.message});
    }

};
module.exports = getMedicAreas;