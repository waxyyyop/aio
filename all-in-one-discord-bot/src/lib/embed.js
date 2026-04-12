const { EmbedBuilder } = require('discord.js');

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
  return build({ title, description, color: 0x57F287 });
}

function error(description, title = 'Error') {
  return build({ title, description, color: 0xED4245 });
}

function info(description, title = 'Info') {
  return build({ title, description, color: 0x5865F2 });
}

module.exports = { build, success, error, info };
