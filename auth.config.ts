export default {
    EMAIL_RESET_SUBJECT : 'Password Reset Request',
    EMAIL_RESET_MESSAGE :
`<p>Hi {{user.name}}.</p>
<p><strong>Forgot your password?</strong><br />We received a request to reset the password for your account.</p>
<p>To reset your password, click on the link below:<br />{{ResetLink}}</p>
<p>Or copy and paste the URL into your browser:<br /><u>{{ResetLinkAsText}}</u></p>
<p>If you did not make this request then please ignore this email.</p>`,
    EMAIL_RESET_LIMITS  : 15 /* minutes */,
    EMAIL_RESET_MAX_AGE : 24 /* hours */,
};
