const rules = {
  firstname: [{ required: true, message: 'Please input user\'s first name!' }],
  lastname: [{ required: true, message: 'Please input user\'s last name!' }],
  userName: [{ required: true, message: 'Please input user\'s username!' }],
  emailAddress: [{ required: true, message: 'Please input user\'s email!' }],
  roleId: [{ required: true, message: 'Please input user\'s role!' }],
};

export default rules;
