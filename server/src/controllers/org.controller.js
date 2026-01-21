const Organization = require("../models/Organization.model");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/**
 * Create Organization + Admin
 */
exports.createOrganization = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // 1️⃣ Check if org already exists
    const existingOrg = await Organization.findOne({ name: orgName });
    if (existingOrg) {
      return res.status(409).json({ message: "Organization name already exists" });
    }

    // 2️⃣ Create organization
    const org = await Organization.create({ name: orgName });

    // 3️⃣ Hash admin password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4️⃣ Create admin user
    const admin = await User.create({
      name: adminName,
      email,
      password: hashedPassword,
      org_id: org._id,
      role: "admin",
      status: "active"
    });

    // 5️⃣ Link admin to organization
    org.createdBy = admin._id;
    await org.save();

    res.status(201).json({
      message: "Organization created successfully",
      organizationId: org._id
    });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: err.message });
  }
};
