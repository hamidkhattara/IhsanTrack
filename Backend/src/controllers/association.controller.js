import { Association, User, DonationProject, Event, Donation } from "../models/index.js";

export const getAllAssociations = async (req, res) => {
  try {
    const where = {};
    if (req.query.wilaya) where.wilaya = req.query.wilaya;

    const associations = await Association.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "is_email_verified"],
        },
      ],
    });
    return res.json(associations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAssociationById = async (req, res) => {
  try {
    const association = await Association.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "full_name", "email", "is_email_verified"] },
        { model: DonationProject, as: "donationProjects" },
        { model: Event, as: "events" },
      ],
    });
    if (!association) return res.status(404).json({ error: "Association not found" });
    return res.json(association);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyAssociation = async (req, res) => {
  try {
    const association = await Association.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "phone", "is_email_verified"],
        },
      ],
    });

    if (!association) {
      return res.status(404).json({ error: "Association profile not found" });
    }

    return res.json(association);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateAssociation = async (req, res) => {
  try {
    const association = await Association.findByPk(req.params.id);
    if (!association) return res.status(404).json({ error: "Association not found" });

    if (association.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this association" });
    }

    await association.update(req.body);
    return res.json(association);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteAssociation = async (req, res) => {
  try {
    const association = await Association.findByPk(req.params.id);
    if (!association) return res.status(404).json({ error: "Association not found" });

    if (association.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this association" });
    }

    await association.destroy();
    return res.json({ message: "Association deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyCampaigns = async (req, res) => {
  try {
    const association = await Association.findOne({ where: { user_id: req.user.id } });
    if (!association) {
      return res.status(404).json({ error: "Association profile not found" });
    }

    const campaigns = await DonationProject.findAll({
      where: { association_id: association.id },
      include: [
        { model: Association, as: "association", attributes: ["id", "name", "wilaya"] },
        {
          model: Donation,
          as: "donations",
          attributes: ["id", "amount", "user_id", "date", "payment_method"],
          include: [{ model: User, as: "donor", attributes: ["id", "full_name", "email", "phone"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(campaigns);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const association = await Association.findOne({ where: { user_id: req.user.id } });
    if (!association) {
      return res.status(404).json({ error: "Association profile not found" });
    }

    const events = await Event.findAll({
      where: { association_id: association.id },
      include: [
        { model: Association, as: "association", attributes: ["id", "name", "wilaya"] },
        {
          model: User,
          as: "volunteers",
          attributes: ["id", "full_name", "email", "phone"],
          through: { attributes: ["status", "registered_at"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
