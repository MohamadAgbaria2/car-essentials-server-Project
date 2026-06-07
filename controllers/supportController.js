import SupportTicket from '../models/SupportTicket.js';

export const createTicket = async (req, res, next) => {
  try {
    const { name, email, issueType, message } = req.body;

    if (!name || !email || !issueType || !message)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (message.length < 10)
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });

    const ticket = await SupportTicket.create({ userId: req.user.id, name, email, issueType, message });
    res.status(201).json({ success: true, message: 'Support request submitted', ticket });
  } catch (err) {
    next(err);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    next(err);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, userId: req.user.id });
    if (!ticket)
      return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.json({ success: true, ticket });
  } catch (err) {
    next(err);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!ticket)
      return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.json({ success: true, message: 'Ticket deleted' });
  } catch (err) {
    next(err);
  }
};

// Complex query 2: filter tickets by issue type + stats
export const filterTickets = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const filter = { userId: req.user.id };
    if (type)   filter.issueType = type;
    if (status) filter.status = status;

    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });

    // Stats breakdown
    const stats = await SupportTicket.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$issueType', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, count: tickets.length, tickets, stats });
  } catch (err) {
    next(err);
  }
};
