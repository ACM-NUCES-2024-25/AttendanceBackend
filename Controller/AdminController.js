const ErrorHandler = require("../Utils/ErrorHandler.js");
const catchAsyncError = require("../Middleware/AsyncError.js");
const Team = require("../Model/TeamModel.js");
const Event = require("../Model/EventModel.js");
const Admin = require("../Model/AdminModel.js");

exports.Login = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Login",
    });
});

exports.GetTeamDetails = catchAsyncError(async (req, res, next) => {
    try {
        const allTeams = await Team.find({});
        res.status(200).json({
            success: true,
            message: "Get Team Details",
            data: allTeams,
        });
    } catch (error) {
        return next(new ErrorHandler("Server Error; teams not found", 501));
    }
});

exports.UpdateTeamAttendance = catchAsyncError(async (req, res, next) => {
    //user will send the code of the team
    const { code } = req.body;

    // fetching the data from database
    try {
        const team = await Team.findOne({
            att_code: code,
        });
        //mark attendance
        team.attendance = true;
        //save updated doc
        await team.save();
        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
        });
    } catch (error) {
        return next(new ErrorHandler("Server Error", 501));
    }
});

exports.GetEventDetails = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Get Event Details",
    });
});

exports.UpdateEventTime = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Update Event Time",
    });
});
