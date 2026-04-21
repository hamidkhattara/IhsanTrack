import { Donation, DonationProject, User } from "../models/index.js";

export const createDonation = async (req, res) => {
  try {
    const donationProject = await DonationProject.findByPk(req.body.donation_project_id);
    if (!donationProject) return res.status(404).json({ error: "Donation project not found" });

    if (donationProject.max_date && new Date(donationProject.max_date) < new Date()) {
      return res.status(400).json({ error: "Donation project has reached its deadline" });
    }

    const donation = await Donation.create({
      ...req.body,
      user_id: req.user.id,
      date: new Date(),
    });

    await donationProject.increment("current_amount", { by: Number(req.body.amount) });

    return res.status(201).json(donation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const where = {};
    if (req.query.donation_project_id) where.donation_project_id = req.query.donation_project_id;
    if (req.query.payment_method) where.payment_method = req.query.payment_method;

    const donations = await Donation.findAll({
      where,
      include: [
        { model: User, as: "donor", attributes: ["id", "full_name", "email"] },
        { model: DonationProject, as: "donationProject", attributes: ["id", "title"] },
      ],
      order: [["date", "DESC"]],
    });
    return res.json(donations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { model: User, as: "donor", attributes: ["id", "full_name", "email"] },
        { model: DonationProject, as: "donationProject" },
      ],
    });
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    return res.json(donation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { user_id: req.user.id },
      include: [{ model: DonationProject, as: "donationProject", attributes: ["id", "title", "goal_amount", "current_amount"] }],
      order: [["date", "DESC"]],
    });
    return res.json(donations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
