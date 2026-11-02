import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { preparationTime, preparationTimeBusy, sizeOptions } from "./products";

type Faq = { q: string; a: string[] };
const groups: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "preparation",
    title: "ORDER PREPARATION",
    items: [
      {
        q: "How long will my set take to make?",
        a: [
          `Every KLAWSEYE set is handmade to order, so our minimum preparation time is ${preparationTime}.`,
          `Depending on order volume and how busy the studio is, preparation can take ${preparationTimeBusy}. Please plan around this before placing your order, especially for events.`,
        ],
      },
      {
        q: "Does express shipping make my order faster?",
        a: [
          "Express shipping only speeds up delivery once your finished set has been dispatched. It does not shorten the handmade preparation time.",
          `Your set still needs ${preparationTime} (${preparationTimeBusy} in busy periods) to be made before it ships.`,
        ],
      },
      {
        q: "Can I get a set in 24 hours or as a rush order?",
        a: ["No. Because each set is sculpted and painted by hand, we can't prepare sets within 24 hours or a few days. The same timeline applies to sets from the shop and to custom designs."],
      },
    ],
  },
  {
    id: "shipping",
    title: "PAYMENT & SHIPPING",
    items: [
      { q: "How do I pay?", a: ["We accept prepaid orders only."] },
      { q: "Where do you ship?", a: ["We ship pan-India. For shipping charges, email orders@klawseye.com before ordering."] },
    ],
  },
  {
    id: "sizing",
    title: "SIZING & FIT",
    items: [
      {
        q: "Which size should I choose?",
        a: [
          `Our standard sizes (thumb to pinky): ${sizeOptions.slice(0, 3).join(" · ")}.`,
          "Not sure? Place a 5-rupee coin next to your bare hand and send us a photo, or order our ₹149 sizing kit. The sizing kit is free with 2 or more sets.",
        ],
      },
      { q: "Can I get custom sizing?", a: ["Yes. Choose “Custom Sizing” on any set and DM us on Instagram with your measurements, and we'll make the set to fit you."] },
      { q: "How many times can I reuse a set?", a: ["Our salon-grade press-ons can be reused 5+ times with gentle removal and the prep kit included with your set."] },
    ],
  },
  {
    id: "policies",
    title: "HYGIENE, RETURNS & STUDIO",
    items: [
      { q: "Can I return or exchange a set?", a: ["Every set is made specially for you, so please email orders@klawseye.com with any hygiene, return or exchange questions before you order."] },
      { q: "How do studio bookings work?", a: ["Studio appointments in Delhi-NCR need a prepaid advance to hold your slot. We send the exact studio address after your booking is confirmed. The studio is closed on Mondays."] },
    ],
  },
];

export function FaqPolicies() {
  return (
<section className="py-16 sm:py-20 bg-gingham" data-purpose="faq-policies">
<div className="max-w-3xl mx-auto px-4 sm:px-6">
<div className="text-center mb-10">
<span className="inline-block bg-brandBlush text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border border-brandGingham uppercase mb-3">{"GOOD TO KNOW"}</span>
<h1 className="font-display text-3xl sm:text-5xl text-brandBlue">{"FAQ & POLICIES"}</h1>
</div>

<div className="timeline-card" role="note" aria-label="Preparation timeline">
<p className="font-display text-brandBlue text-lg">{"✂ HANDMADE TO ORDER"}</p>
<p className="font-body text-copy">{"Minimum preparation time: "}<strong className="text-brandBlue">{preparationTime}</strong>{`. Depending on order volume, it can take ${preparationTimeBusy}.`}</p>
<p className="font-body text-sm text-muted-foreground">{"Express shipping speeds up delivery only. It does not speed up preparation."}</p>
</div>

{groups.map(group => (
<div key={group.id} id={group.id} className="faq-group">
<h2 className="font-display text-xl text-brandBlue mb-2">{group.title}</h2>
<Accordion type="multiple" defaultValue={group.id === "preparation" ? group.items.map(item => item.q) : []} className="bg-card border-2 border-brandBlue rounded-2xl shadow-sticker px-5">
{group.items.map(item => (
<AccordionItem key={item.q} value={item.q} className="border-brandGingham last:border-b-0">
<AccordionTrigger className="font-body font-bold text-brandBlue text-left">{item.q}</AccordionTrigger>
<AccordionContent className="font-body text-copy space-y-2">{item.a.map(line => <p key={line}>{line}</p>)}</AccordionContent>
</AccordionItem>
))}
</Accordion>
</div>
))}

<p className="text-center text-sm text-copy mt-10">{"Still have a question? Email orders@klawseye.com or "}<Link to="/custom" className="text-brandRose font-bold underline">{"start a custom order"}</Link>{"."}</p>
</div>
</section>
  );
}
