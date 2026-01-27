async function me(req, res) {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
}

module.exports = { me };
