const { initialise } = require('./sequelize');

function isSecure(request) {
  // socket is https server
  if (request.connection && request.connection.encrypted) {
    return true;
  }

  if (request.headers['x-arr-ssl']) {
    return true;
  }

  // read the proto from x-forwarded-proto header
  const header = request.headers['x-forwarded-proto'] || '';
  const index = header.indexOf(',');
  const proto =
    index !== -1
      ? header
          .substr(0, index)
          .toLowerCase()
          .trim()
      : header.toLowerCase().trim();

  return proto === 'https';
}

async function registerUser(orgDetails) {
  console.log('orgDetails here===', orgDetails);
  try {
    let { user } = await initialise('individual', true);
    return await createUser(orgDetails, user);
  } catch (e) {
    console.log('error creating user.');
    throw new Error(e);
  }
}



async function createUser(details, ormHandle) {
    let {
      password,
      username,
      firstname,
      lastname
    } = details;

    await ormHandle.create({
      password,
      username,
      firstname,
      lastname
    });
}

module.exports = {
  isSecure,
  findUserName,
  findClientName,
  forgetPassword,
  resetPassword,
  registerUser
};