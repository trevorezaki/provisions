export default function SectionHeading({ children }) {
  return (
    <div className="relative inline-block mb-3">
      <span
        className="absolute -left-1.5 -right-1.5 bottom-0 h-3 bg-gold"
        style={{
          clipPath:
            "polygon(0 0,100% 0,100% 65%,88% 100%,76% 65%,64% 100%,52% 65%,40% 100%,28% 65%,16% 100%,4% 65%,0 100%)",
        }}
      />
      <h2 className="relative font-display font-semibold text-lg text-navy capitalize">
        {children}
      </h2>
    </div>
  );
}
