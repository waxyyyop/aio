const { EmbedBuilder } = require('discord.js');
const colors = require('../assets/colors');

function build({ title, description, color, fields, thumbnail, image }) {
  const e = new EmbedBuilder().setTimestamp();
  if (title) e.setTitle(title);
  if (description) e.setDescription(description);
  if (color) e.setColor(color);
  if (thumbnail) e.setThumbnail(thumbnail);
  if (image) e.setImage(image);
  if (fields && fields.length) e.addFields(fields);
  return e;
}

function success(description, title = 'Success') {
  return build({ title, description, color: colors.success });
}

function error(description, title = 'Error') {
  return build({ title, description, color: colors.error });
}

function info(description, title = 'Info') {
  return build({ title, description, color: colors.info });
}

function warning(description, title = 'Warning') {
  return build({ title, description, color: colors.warning });
}

function premium(description, title = 'Premium') {
  return build({ title, description, color: colors.premium });
}

module.exports = { build, success, error, info, warning, premium };
