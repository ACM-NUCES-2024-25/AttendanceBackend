const ErrorHandler = require("../Utils/ErrorHandler.js");
const catchAsyncError = require("../Middleware/AsyncError.js");
const MarkAttendance = require("../Model/MarkAttendanceModel.js");
const Event = require("../Model/EventModel.js");

const { DistanceCheck } = require("../Utils/MarkAttendanceUtils.js");

exports.MarkTeamAttendance = catchAsyncError(async (req, res, next) => {
    //fetching location of user
    const { code, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return next(
            new ErrorHandler("Error: Please enable location services.", 400)
        );
    }

    try {
        //fetching participant from the database
        const doc = await MarkAttendance.findOne({ att_code: code });
        if (!doc) {
            return next(new ErrorHandler("Error: Entry not Found.", 404));
        }
        //checking the competition
        const eventDetails = await Event.findOne({
            competitionName: doc.Competition,
        });
        if (!eventDetails) {
            return next(new ErrorHandler("Error: Competition details not found.", 404));
        }

        //validating if the user is in university or not
        const distance = DistanceCheck(latitude, longitude);
        if (distance > 1000) {
            return next(new ErrorHandler("Error: You are not in the vicinity of the event.", 403));
        }

        // validating if the competition is going on or not

        const currentTime = new Date(); // This would not work, the current time should be passed by the user's device
        const eventStartTime = new Date(eventDetails.start_time);
        const eventEndTime = new Date(eventDetails.end_time);

        if (currentTime < eventStartTime || currentTime > eventEndTime) {
            return next(new ErrorHandler("Error: Competition has not started or has ended.", 403));
        }
        //if it was previously marked
        if (doc.attendance) {
            
            return res
                .status(200)
                .json({ message: "Your attendance has already been marked." });
        }

        doc.attendance = true;
        await doc.save();

        return res.status(200).json({
            success: true,
            message: "Your attendance has been marked.",
            teamName: doc.Team_Name,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
