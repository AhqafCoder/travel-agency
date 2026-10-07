// Importing this barrel registers every schema on the shared mongoose
// instance, so populate() always finds its ref — regardless of which
// module graph (page or route handler) touched the DB first.
import "./User";
import "./Captain";
import "./Destination";
import "./Trip";
import "./Departure";
import "./Booking";
import "./Payment";
import "./Review";
import "./Coupon";
import "./Lead";
import "./Story";
import "./Experience";
