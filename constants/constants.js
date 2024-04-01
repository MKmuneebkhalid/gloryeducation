module.exports = {
    INTERNAL_ERROR:
        "Sorry! a problem occurred while processing this request. Please try again later. ",
    //DEFAULT_COUNTER_INDEX: "5d6682161dcfcb474869",
    DEFAULT_COUNTER_INDEX: 1,
    DEFAULT_COUNTER_TYPE: {
        CUSTOMER: "customer",
        AUTH: "auth",
        MERCHANT: "merchant",
    },
    TFA: {
        OTP_ERROR:
            "The verification code provided is either invalid or now expired.",
        OTP_EXPIRE_30MINS: 1800, //in seconds
    },
    GES: {
        SECRET: "00EFIJpGlznyrYcZicwMuKKrdtNsgWrQBcIs6YSa-E",
        OTP_EMAIL_SUBJECT: "GES Verification Code",
        WELCOME_EMAIL_SUBJECT: "Welcome to Glory Education!",
        EMAIL_SENDER: "no-reply@gloryeduserve.com",
    },
    CANDIDATE_PROFILE_EXIST: "Candidate profile already exists",
};