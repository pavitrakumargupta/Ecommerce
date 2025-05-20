import { User } from '../models/User.js';

export const getUserList = async (req, res) => {
  try {
    const { search } = req.query ;
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { firstname: regex },
        { email: regex },
        { phone: regex },
      ];
    }
    const users = await User.find(query).select('-password').lean();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const updateUserStatus = async (req, res)=> {
  const { userId } = req.params;
  const { action } = req.body; 

  if (!userId || !action) {
    res.status(400).json({ message: 'User ID and action are required' });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    switch (action) {
      case 'block':
        user.isBlocked = true;
        break;
      case 'activate':
        user.isBlocked = false;
        break;
      case 'approve':
        user.isApproved = true;
        break;
      case 'reject':
        user.isApproved = false;
        break;
      case 'delete':
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
        return;
      default:
        res.status(400).json({ message: 'Invalid action' });
        return;
    }

    await user.save();

    res.json({ message: `User ${action}d successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
