const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Authenticate: verify JWT and attach user payload to req.user
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'Authentication required' });

        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // payload should include at least { id, role, ... }
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// Generic role authorizer: pass roles that are allowed (e.g. 'admin', 'user')
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Authentication required' });
        if (allowedRoles.includes(req.user.role)) return next();
        return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    };
}

// Convenience middleware for admin-only routes
const authorizeAdmin = authorizeRoles('admin');

// Convenience middleware for user routes (users and admins allowed)
const authorizeUser = authorizeRoles('user', 'admin');

// Authorize book access: allows admin or the book owner.
// bookService must provide an async getById(id) or findById(id) that returns the book object.
// The book owner field can be owner, ownerId, or userId (string/ObjectId).
function authorizeBookAccess(bookService) {
    if (!bookService || (typeof bookService.findById !== 'function' && typeof bookService.getById !== 'function')) {
        throw new Error('authorizeBookAccess requires a bookService with findById or getById');
    }

    const finder = bookService.findById ? bookService.findById.bind(bookService) : bookService.getById.bind(bookService);

    return async (req, res, next) => {
        try {
            if (!req.user) return res.status(401).json({ message: 'Authentication required' });

            // allow admins
            if (req.user.role === 'admin') return next();

            const bookId = req.params.id || req.params.bookId || req.body.bookId;
            if (!bookId) return res.status(400).json({ message: 'Book id is required' });

            const book = await finder(bookId);
            if (!book) return res.status(404).json({ message: 'Book not found' });

            const ownerId = (book.owner || book.ownerId || book.userId || book.user)?.toString?.() ?? null;
            if (!ownerId) return res.status(403).json({ message: 'Forbidden: cannot determine book owner' });

            if (ownerId === String(req.user.id)) return next();
            return res.status(403).json({ message: 'Forbidden: not book owner' });
        } catch (err) {
            return res.status(500).json({ message: 'Authorization error' });
        }
    };
}

module.exports = {
    authenticate,
    authorizeRoles,
    authorizeAdmin,
    authorizeUser,
    authorizeBookAccess,
};