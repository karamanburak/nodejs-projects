"use strict";
const Contact = require("../models/contactModel");
const { sequelize } = require("../configs/db");
const { trace } = require("../routers/contactRouter");

module.exports = {
  list: async (req, res, next) => {
    // const data = await sequelize.query("SELECT * FROM contacts"); //* klasik sql sorgularin yerine ORM kullaniyoruz.
    // const data = await Contact.findAndCountAll();
    // const data = await Contact.findAll();

    //   try {
    //     const data = await Contact.findAll({
    //       where: {
    //         isActive: true,
    //       },
    //     });
    //     // throw new Error("Hata firlattim, yakala!");
    //     res.status(200).send({
    //       error: false,
    //       contacts: datas,
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // },

    const data = await Contact.findAll({
      where: {
        isActive: true,
      },
    });
    // throw new Error("Hata firlattim, yakala!");
    res.status(200).send({
      error: false,
      contacts: data,
    });
  },
  create: async (req, res) => {
    //* SQL (Klasik sql sorgusu) 1. eski ve uzun yol
    // const { firstName, lastName, email, phone, address, isActive } = req.body;
    // const data = await sequelize.query(
    //   "INSERT INTO contacts (firstName, lastName, email, phone, address, createdAt, updatedAt, isActive) VALUES (?,?,?,?,?,?,?,?)",
    //   {
    //     replacements: [
    //       firstName,
    //       lastName,
    //       email,
    //       phone,
    //       address,
    //       new Date(),
    //       new Date(),
    //       isActive || true,
    //     ],
    //   }
    // );

    //* Sequelize (ORM) 2. kisa ve yeni yol
    const data = await Contact.create(req.body);
    res.status(201).send({
      error: false,
      contact: data,
    });
  },
  get: async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      res.status(200).send({
        error: false,
        contact,
      });
    } else {
      res.errorStatusCode = 404;
      throw new Error("Istenilen contact bilgisi bulunmadi!", {
        cause: `Gönderilen contact id bilgisi : ${req.params.id}`,
      });
    }
  },
  update: async (req, res) => {
    const contact = await Contact.update(req.body, {
      where: { id: req.params.id },
    });

    let updatedContact;
    if (contact == 1) {
      updatedContact = await Contact.findByPk(req.params.id);
      res.status(201).send({
        error: false,
        contact,
        updatedContact,
      });
    } else {
      res.errorStatusCode = 404;
      throw new Error("Istenilen contact bilgisi bulunmadi!", {
        cause: `Gönderilen contact id bilgisi : ${req.params.id}`,
      });
    }
  },

  delete: async (req, res) => {
    const contact = await Contact.destroy({ where: { id: req.params.id } });
    if (contact) {
      res.status(204).send({
        error: false,
        contact,
      });
    } else {
      res.errorStatusCode = 404;
      throw new Error("Istenilen contact bilgisi bulunmadi!", {
        cause: `Gönderilen contact id bilgisi : ${req.params.id}`,
      });
    }
  },
};
