const { Document } = require("../models");

const createDocument = async (docBody) => {
  const document = await Document.create(docBody);
  return document.toJSON();
};

const findDocument = async (whereQuery, attributes = null) => {
  const document = await Document.findOne({ where: whereQuery, attributes });
  if (!document) throw new Error("Your document doesn't exits!");
  return document.toJSON();
};

const findAllDocument = async (whereQuery, attributes = null) => {
  const document = await Document.findAll({
    where: whereQuery,
    attributes,
  });
  if (!document) throw new Error("Your document doesn't exits!");
  return document;
};

const findAllPaginatedDocument = async (
  whereQuery,
  limit,
  page,
  attributes = null
) => {
  const document = await Document.findAll({
    where: whereQuery,
    attributes,
    limit: limit,
    offset: (page - 1) * limit,
  });
  if (!document) throw new Error("Your document doesn't exits!");
  return document;
};

const deleteDocument = async (whereQuery) => {
  const document = await Document.destroy({ where: whereQuery });
  if (!document) throw new Error("Your account doesn't exits!");
  return document;
};

const updateDocument = async (id, docBody) => {
  const document = await Document.update({ ...docBody }, { where: { id } });
  return document;
};

module.exports = {
  createDocument,
  findDocument,
  findAllDocument,
  deleteDocument,
  updateDocument,
  findAllPaginatedDocument,
};
