import { L } from '../../lib/abpUtility';

const rules = {
  username: [
    {
      required: true,
      message: L('ThisFieldIsRequired'),
    },
  ],
  password: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
