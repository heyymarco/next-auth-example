// templates:
import {
    // react:
    User,
}                           from '@/templates/User'
import {
    // react:
    ResetPassword,
}                           from '@/templates/ResetPassword'



export default {
    SESSION_MAX_AGE     : 24   /* hours */,
    SESSION_UPDATE_AGE  : 6    /* hours */,
    
    
    
    EMAIL_RESET_SUBJECT : 'Password Reset Request',
    EMAIL_RESET_MESSAGE : <>
        <p>Hi <User.Name />.</p>
        <p><strong>Forgot your password?</strong><br />We received a request to reset the password for your account.</p>
        <p>To reset your password, click on the link below:<br /><ResetPassword.Link>Reset Password</ResetPassword.Link></p>
        <p>Or copy and paste the URL into your browser:<br /><u><ResetPassword.Url /></u></p>
        <p>If you did not make this request then please ignore this email.</p>
    </>,
    EMAIL_RESET_LIMITS  : 0.25 /* hours */,
    EMAIL_RESET_MAX_AGE : 24   /* hours */,
};
