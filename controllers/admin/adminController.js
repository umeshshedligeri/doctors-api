let HospitalSchema = require("../../models/hospital");
let Doctor = require("../../models/doctors");
let bcrypt = require("bcryptjs");
let User = require("../../models/user");
var ObjectId = require('mongoose').Types.ObjectId;


exports.createHospital = async (req, res) => {

    let { Name, Address, City, Location } = req.body;

    if (!req.body.Name) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital name can not be empty!"
        });
    }
    if (!req.body.Address) {
        return res.send({
            status: 400,
            success: false,
            message: "Address can not be empty!"
        });
    }
    if (!req.body.City) {
        return res.send({
            status: 400,
            success: false,
            message: "City can not be empty!"
        });
    }
    try {
        const hospitalObj = new HospitalSchema({
            Name: Name,
            Address: Address,
            City: City,
            FileLocation: Location
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
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.addDoctors = async (req, res) => {
    let { FirstName, LastName, MobileNumber, Hospital, Speciality, Location } = req.body;
    if (!req.body.FirstName) {
        return res.send({
            status: 400,
            success: false,
            message: "First name can not be empty!"
        });
    }
    if (!req.body.LastName) {
        return res.send({
            status: 400,
            success: false,
            message: "Last name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Hospital) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital can not be empty!"
        });
    }
    if (!req.body.Speciality) {
        return res.send({
            status: 400,
            success: false,
            message: "Speciality can not be empty!"
        });
    }

    try {
        const doctorObj = new Doctor({
            FirstName: FirstName,
            LastName: LastName,
            MobileNumber: MobileNumber,
            Hospital: Hospital,
            Speciality: Speciality,
            FileLocation: Location
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
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.getDoctorInfo = async (req, res) => {
    let doctorId = req.params.doctorId;
    if (!doctorId) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor Id can not be empty!"
        });
    }
    try {
        let doctor = await Doctor.findById(doctorId).populate('Hospital');
        if (doctor) {
            return res.send({
                status: 200,
                success: true,
                message: "Doctor details found successfully",
                data: doctor
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "No data found"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }

}

exports.updateDoctorInfo = async (req, res) => {
    let { doctorId, FirstName, LastName, MobileNumber, HospitalID, Speciality, Location } = req.body;
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!doctorId) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor Id can not be empty!"
        });
    }
    if (!FirstName) {
        return res.send({
            status: 400,
            success: false,
            message: "First Name can not be empty!"
        });
    }
    if (!LastName) {
        return res.send({
            status: 400,
            success: false,
            message: "Last Name can not be empty!"
        });
    }
    if (!MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile Number can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!Speciality) {
        return res.send({
            status: 400,
            success: false,
            message: "Speciality can not be empty!"
        });
    }
    try {
        let updateDoctor = await Doctor.findByIdAndUpdate(doctorId,
            {
                FirstName: FirstName,
                LastName: LastName,
                MobileNumber: MobileNumber,
                Hospital: HospitalID,
                Speciality: Speciality,
                FileLocation: Location
            })
        if (updateDoctor) {
            return res.send({
                status: 200,
                success: true,
                message: "Doctor details updated successfully",
                data: updateDoctor
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "Error while updating doctor details"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.updateHospitalInfo = async (req, res) => {
    let { Name, Address, City, Location, HospitalID } = req.body;
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!Name) {
        return res.send({
            status: 400,
            success: false,
            message: "Name can not be empty!"
        });
    }
    if (!Address) {
        return res.send({
            status: 400,
            success: false,
            message: "Address can not be empty!"
        });
    }
    if (!City) {
        return res.send({
            status: 400,
            success: false,
            message: "City can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    try {
        let updateHospital = await HospitalSchema.findByIdAndUpdate(HospitalID,
            {
                Name: Name,
                Address: Address,
                City: City,
                FileLocation: Location
            })
        if (updateHospital) {
            return res.send({
                status: 200,
                success: true,
                message: "Hospital details updated successfully",
                data: updateHospital
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "Error while updating hospital details"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.getHospitalInfo = async (req, res) => {
    let HospitalID = req.params.HospitalID;
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    try {
        let hospital = await HospitalSchema.findById(HospitalID);
        if (hospital) {
            return res.send({
                status: 200,
                success: true,
                message: "Hospital details found successfully",
                data: hospital
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "No data found"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.addReceptionalist = async (req, res) => {
    // Validate request
    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!req.body.FullName) {
        return res.send({
            status: 400,
            success: false,
            message: "Full name can not be empty!"
        });
    }
    if (!req.body.MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!req.body.Email) {
        return res.send({
            status: 400,
            success: false,
            message: "Email can not be empty!"
        });
    }
    if (!req.body.Password) {
        return res.send({
            status: 400,
            success: false,
            message: "Password can not be empty!"
        });
    }
    if (!req.body.HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!req.body.DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }

    try {
        let salt = bcrypt.genSaltSync(10);
        const newUserOBj = new User({
            FullName: req.body.FullName,
            MobileNumber: req.body.MobileNumber,
            Email: req.body.Email,
            Password: bcrypt.hashSync(req.body.Password, salt),
            Role: "reception",
            DeviceToken: req.body.DeviceToken,
            Hospital: req.body.HospitalID,
            Doctor: req.body.DoctorID
        })

        newUserOBj.save()
            .then(data => {
                return res.send({
                    status: 200,
                    success: true,
                    message: "Receptionalist added successfully",
                    data: data
                });
            })
            .catch(err => {
                return res.send({
                    status: 400,
                    success: false,
                    message: "Error while adding receptionalist!",
                    data: err
                });
            })
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.updateReceptionalist = async (req, res) => {
    // Validate request
    let { ReceptionalistID, FullName, MobileNumber, Email, Location } = req.body;

    if (!req.body) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!FullName) {
        return res.send({
            status: 400,
            success: false,
            message: "Full name can not be empty!"
        });
    }
    if (!MobileNumber) {
        return res.send({
            status: 400,
            success: false,
            message: "Mobile number can not be empty!"
        });
    }
    if (!Email) {
        return res.send({
            status: 400,
            success: false,
            message: "Email can not be empty!"
        });
    }
    if (!ReceptionalistID) {
        return res.send({
            status: 400,
            success: false,
            message: "Receptionalist ID can not be empty!"
        });
    }
    try {
        let updateReception = await User.findByIdAndUpdate(ReceptionalistID,
            {
                FullName: FullName,
                MobileNumber: MobileNumber,
                Email: Email,
                FileLocation: Location
            })
        if (updateReception) {
            return res.send({
                status: 200,
                success: true,
                message: "Receptionalist details updated successfully",
                data: updateReception
            });
        }
        else {
            return res.send({
                status: 400,
                success: false,
                message: "Error while updating Receptionalist details"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}

exports.getReceptionalists = async (req, res) => {

    let { HospitalID, DoctorID } = req.query;
    if (!req.query) {
        return res.send({
            status: 400,
            success: false,
            message: "Content can not be empty!"
        });
    }
    if (!HospitalID) {
        return res.send({
            status: 400,
            success: false,
            message: "Hospital ID can not be empty!"
        });
    }
    if (!DoctorID) {
        return res.send({
            status: 400,
            success: false,
            message: "Doctor ID can not be empty!"
        });
    }
    try {
        let receptionalists = await User.find({ Hospital: ObjectId(HospitalID), Doctor: ObjectId(DoctorID) });
        if(receptionalists){
            return res.send({
                status: 200,
                success: true,
                message: "Receptionalists found successfully",
                data: receptionalists
            });
        }
        else{
            return res.send({
                status: 400,
                success: false,
                message: "Error while fetching Receptionalists"
            });
        }
    }
    catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: "Something went wrong",
            data: err
        });
    }
}