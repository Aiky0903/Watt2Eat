import { motion } from "framer-motion";

//* Page Wrapper for Slide-in, Fade-out Animation
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
