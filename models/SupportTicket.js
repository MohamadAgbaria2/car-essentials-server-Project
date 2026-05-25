import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true },
  issueType: {
    type: String,
    enum: ['technical', 'billing', 'feature', 'other'],
    required: true
  },
  message: { type: String, required: true, minlength: 10 },
  status:  { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('SupportTicket', supportTicketSchema);
