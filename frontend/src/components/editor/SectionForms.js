"use client";

import { ColorInput, DateTime, GalleryInput, ImageInput, ListEditor, Select, Text, TextArea, Toggle } from "./fields";

// Each form receives the section `data` and `set(patch)` which merges into it.
const Heading = ({ d, set }) => <Text label="Section heading" value={d.heading} onChange={(v) => set({ heading: v })} />;

const FORMS = {
  hero: ({ d, set }) => (
    <>
      <Text label="Main title / names" value={d.title} onChange={(v) => set({ title: v })} placeholder="Ayesha & Ahmed" maxLength={80} />
      <Text label="Subtitle" value={d.subtitle} onChange={(v) => set({ subtitle: v })} placeholder="are getting married" />
      <Text label="Small text above title" value={d.tagline} onChange={(v) => set({ tagline: v })} placeholder="Together with their families…" />
      <DateTime label="Event date" value={d.date} onChange={(v) => set({ date: v })} />
      <ImageInput label="Cover photo" value={d.image} onChange={(v) => set({ image: v })} />
      <Select
        label="Photo style"
        value={d.layout || "center"}
        onChange={(v) => set({ layout: v })}
        options={[
          { value: "center", label: "Full background photo" },
          { value: "portrait", label: "Round framed photo" },
        ]}
      />
    </>
  ),
  hosts: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <ListEditor
        itemLabel="Person"
        items={d.people}
        onChange={(people) => set({ people })}
        newItem={() => ({ name: "", role: "", photo: "", bio: "" })}
        max={6}
        renderItem={(p, up) => (
          <>
            <ImageInput label="Photo" shape="circle" value={p.photo} onChange={(v) => up({ photo: v })} />
            <Text label="Name" value={p.name} onChange={(v) => up({ name: v })} />
            <Text label="Role" value={p.role} onChange={(v) => up({ role: v })} placeholder="The Bride / Host / Birthday girl" />
            <TextArea label="Short bio" rows={2} value={p.bio} onChange={(v) => up({ bio: v })} placeholder="Daughter of Mr. & Mrs. …" />
          </>
        )}
      />
    </>
  ),
  story: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <TextArea label="Story" rows={6} value={d.text} onChange={(v) => set({ text: v })} />
      <ImageInput label="Photo" value={d.image} onChange={(v) => set({ image: v })} />
    </>
  ),
  event: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <ListEditor
        itemLabel="Event"
        items={d.items}
        onChange={(items) => set({ items })}
        newItem={() => ({ name: "", date: "", time: "", venue: "", address: "" })}
        max={8}
        renderItem={(e, up) => (
          <>
            <Text label="Event name" value={e.name} onChange={(v) => up({ name: v })} placeholder="Mehndi / Barat / Walima" />
            <DateTime label="Date" value={e.date} onChange={(v) => up({ date: v })} />
            <Text label="Time (as shown)" value={e.time} onChange={(v) => up({ time: v })} placeholder="7:30 PM onwards" />
            <Text label="Venue" value={e.venue} onChange={(v) => up({ venue: v })} />
            <Text label="Address" value={e.address} onChange={(v) => up({ address: v })} />
            <Text label="Note" value={e.note} onChange={(v) => up({ note: v })} placeholder="Dinner will be served" />
          </>
        )}
      />
    </>
  ),
  countdown: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <DateTime label="Count down to" value={d.target} onChange={(v) => set({ target: v })} />
    </>
  ),
  schedule: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <ListEditor
        itemLabel="Item"
        items={d.items}
        onChange={(items) => set({ items })}
        newItem={() => ({ time: "", title: "", description: "" })}
        renderItem={(x, up) => (
          <>
            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <Text label="Time" value={x.time} onChange={(v) => up({ time: v })} placeholder="8:00 PM" maxLength={20} />
              <Text label="Title" value={x.title} onChange={(v) => up({ title: v })} />
            </div>
            <Text label="Description" value={x.description} onChange={(v) => up({ description: v })} />
          </>
        )}
      />
    </>
  ),
  venue: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <Text label="Venue name" value={d.name} onChange={(v) => set({ name: v })} />
      <TextArea label="Address" rows={2} value={d.address} onChange={(v) => set({ address: v })} />
      <Text label="Map search (optional)" hint="Exact place name or coordinates for Google Maps. Leave empty to use the address." value={d.mapQuery} onChange={(v) => set({ mapQuery: v })} />
      <ImageInput label="Venue photo" value={d.image} onChange={(v) => set({ image: v })} />
    </>
  ),
  gallery: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <Select
        label="Layout"
        value={d.layout || "grid"}
        onChange={(v) => set({ layout: v })}
        options={[
          { value: "grid", label: "Square grid" },
          { value: "masonry", label: "Masonry (original shapes)" },
        ]}
      />
      <GalleryInput value={d.images} onChange={(images) => set({ images })} />
    </>
  ),
  video: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <Text label="YouTube / Vimeo / MP4 link" value={d.url} onChange={(v) => set({ url: v })} placeholder="https://youtu.be/…" maxLength={500} />
    </>
  ),
  dresscode: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <TextArea label="Description" rows={2} value={d.text} onChange={(v) => set({ text: v })} />
      <p className="label">Colour palette</p>
      <div className="grid grid-cols-2 gap-2">
        {(d.colors || []).map((c, i) => (
          <div key={i} className="flex items-end gap-1">
            <div className="flex-1">
              <ColorInput value={c} onChange={(v) => set({ colors: d.colors.map((x, k) => (k === i ? v : x)) })} />
            </div>
            <button type="button" className="mb-2 text-xs text-red-600" onClick={() => set({ colors: d.colors.filter((_, k) => k !== i) })}>
              ✕
            </button>
          </div>
        ))}
      </div>
      {(d.colors?.length || 0) < 8 && (
        <button type="button" className="btn-secondary !py-1.5 !text-xs" onClick={() => set({ colors: [...(d.colors || []), "#be185d"] })}>
          ＋ Add colour
        </button>
      )}
    </>
  ),
  rsvp: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <TextArea label="Message" rows={2} value={d.text} onChange={(v) => set({ text: v })} />
      <DateTime label="Respond by" dateOnly value={d.deadline} onChange={(v) => set({ deadline: v })} />
      <Text label="Max guests per RSVP" type="number" value={d.maxGuests} onChange={(v) => set({ maxGuests: Math.max(1, Math.min(50, Number(v) || 1)) })} />
      <Toggle label="Ask for phone number" checked={d.askPhone !== false} onChange={(v) => set({ askPhone: v })} />
    </>
  ),
  wishes: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <TextArea label="Message" rows={2} value={d.text} onChange={(v) => set({ text: v })} />
    </>
  ),
  contact: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <ListEditor
        itemLabel="Contact"
        items={d.people}
        onChange={(people) => set({ people })}
        newItem={() => ({ name: "", phone: "", whatsapp: true })}
        max={6}
        renderItem={(p, up) => (
          <>
            <Text label="Name" value={p.name} onChange={(v) => up({ name: v })} />
            <Text label="Phone (with country code)" type="tel" value={p.phone} onChange={(v) => up({ phone: v })} placeholder="+92 300 1234567" />
            <Toggle label="Show WhatsApp button" checked={p.whatsapp} onChange={(v) => up({ whatsapp: v })} />
          </>
        )}
      />
    </>
  ),
  note: ({ d, set }) => (
    <>
      <Heading d={d} set={set} />
      <TextArea label="Text" rows={5} value={d.text} onChange={(v) => set({ text: v })} />
    </>
  ),
};

export default function SectionForm({ section, onChange }) {
  const Form = FORMS[section.type];
  if (!Form) return null;
  const d = section.data || {};
  return (
    <div className="space-y-4">
      <Form d={d} set={(patch) => onChange({ ...d, ...patch })} />
    </div>
  );
}

