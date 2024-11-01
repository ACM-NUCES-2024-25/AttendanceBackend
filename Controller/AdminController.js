const ErrorHandler = require("../Utils/ErrorHandler.js");
const catchAsyncError = require("../Middleware/AsyncError.js");
const Team = require("../Model/TeamModel.js");
const Event = require("../Model/EventModel.js");
const Admin = require("../Model/AdminModel.js");

exports.Login = catchAsyncError(async (req , res , next) => {
    res.status(200).json({
        success: true,
        message: "Login"
    });
})

exports.GetTeamDetails = catchAsyncError(async (req , res , next) => {
    res.status(200).json({
        success: true,
        message: "Get Team Details"
    });
});

exports.UpdateTeamAttendance = catchAsyncError(async (req , res , next) => {
    res.status(200).json({
        success: true,
        message: "Update Team Attendance"
    });
});

exports.GetEventDetails = catchAsyncError(async (req, res, next) => {
    const { competitionName } = req.body; // Get competition name from request body
    const event = await Event.find({});

    if (!event) {
        return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
        success: true,
        event,
    });
});

exports.UpdateEventTime = catchAsyncError(async (req, res, next) => {
    const { competitionName, start_time, end_time } = req.body; // Get from request body

    // Find the event by competition name and update the times
    const updatedEvent = await Event.findOneAndUpdate(
        { competitionName },
        { start_time, end_time },
        { new: true, runValidators: true } // Returns the updated document and applies validators
    );

    if (!updatedEvent) {
        return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
        success: true,
        updatedEvent,
    });
});
