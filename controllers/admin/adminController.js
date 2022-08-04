let HospitalSchema = require("../../models/hospital");
let Doctor = require("../../models/doctors");

exports.createHospital = async (req, res) => {

    let { Name, Address, City } = req.body;

    if (!req.body.Name) {
        res.status(400).send({
            message: "Hospital name can not be empty!"
        });
    }
    if (!req.body.Address) {
        res.status(400).send({
            message: "Address can not be empty!"
        });
    }
    if (!req.body.City) {
        res.status(400).send({
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
            res.status(200).send({
                message: "Hospital created successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(400).send({
                message: "Error while creating the hospital!",
                data: err
            });
        })
}

exports.addDoctors = async (req, res) => {
    let { FirstName, LastName, MobileNumber, Hospital, Speciality } = req.body;
    if (!req.body.FirstName) {
        res.status(400).send({
            message: "First name can not be empty!"
        });
    }
    if (!req.body.LastName) {
        res.status(400).send({
            message: "Last name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        res.status(400).send({
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Hospital) {
        res.status(400).send({
            message: "Hospital can not be empty!"
        });
    }
    if (!req.body.Speciality) {
        res.status(400).send({
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
            res.status(200).send({
                message: "Doctor added successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(400).send({
                message: "Error while adding a doctor!",
                data: err
            });
        })
}
