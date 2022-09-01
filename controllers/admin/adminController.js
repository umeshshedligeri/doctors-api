let HospitalSchema = require("../../models/hospital");
let Doctor = require("../../models/doctors");

exports.createHospital = async (req, res) => {

    let { Name, Address, City } = req.body;

    if (!req.body.Name) {
        res.send({
            status: 400,
            success: false,
            message: "Hospital name can not be empty!"
        });
    }
    if (!req.body.Address) {
        res.send({
            status: 400,
            success: false,
            message: "Address can not be empty!"
        });
    }
    if (!req.body.City) {
        res.send({
            status: 400,
            success: false,
            message: "City can not be empty!"
        });
    }
    const hospitalObj = new HospitalSchema({
        Name: Name,
        Address: Address,
        City: City
    });
    hospitalObj.save()
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Hospital created successfully",
                data: data
            });
        })
        .catch(err => {
            res.send({
                status: 400,
                success: false,
                message: "Error while creating the hospital!",
                data: err
            });
        })
}

exports.addDoctors = async (req, res) => {
    let { FirstName, LastName, MobileNumber, Hospital, Speciality } = req.body;
    if (!req.body.FirstName) {
        res.send({
            status: 400,
            success: false,
            message: "First name can not be empty!"
        });
    }
    if (!req.body.LastName) {
        res.send({
            status: 400,
            success: false,
            message: "Last name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Hospital) {
        res.send({
            status: 400,
            success: false,
            message: "Hospital can not be empty!"
        });
    }
    if (!req.body.Speciality) {
        res.send({
            status: 400,
            success: false,
            message: "Speciality can not be empty!"
        });
    }
    const doctorObj = new Doctor({
        FirstName: FirstName,
        LastName: LastName,
        MobileNumber: MobileNumber,
        Hospital: Hospital,
        Speciality: Speciality
    });
    doctorObj.save()
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Doctor added successfully",
                data: data
            });
        })
        .catch(err => {
            res.send({
                status: 400,
                success: false,
                message: "Error while adding a doctor!",
                data: err
            });
        })
}
