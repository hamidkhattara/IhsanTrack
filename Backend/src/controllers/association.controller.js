import { Association, User, DonationProject } from "../models/index.js";

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
      ],
    });
    if (!association) return res.status(404).json({ error: "Association not found" });
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
