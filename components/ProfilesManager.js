"use client";

import { useState } from "react";
import { createProfile, updateProfile, deleteProfile } from "@/app/actions";
import AllergenPicker from "@/components/AllergenPicker";
import { allergenLabel } from "@/lib/allergens";

function ProfileForm({ profile, onDone }) {
  const [name, setName] = useState(profile?.name || "");
  const [selected, setSelected] = useState(new Set(profile?.allergens || []));

  const action = profile ? updateProfile : createProfile;

  return (
    <form
      action={action}
      onSubmit={() => setTimeout(onDone, 0)}
      className="bg-white border border-stone-200 rounded-lg p-4 mb-3"
    >
      {profile && <input type="hidden" name="id" value={profile.id} />}
      <input
        type="hidden"
        name="allergens"
        value={JSON.stringify(Array.from(selected))}
      />

      <label className="block font-body text-xs font-semibold text-stone-500 mb-1">
        Name
      </label>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Alex"
        required
        className="w-full rounded-md border border-stone-300 px-2.5 py-1.5 font-body text-sm bg-white mb-3"
      />

      <label className="block font-body text-xs font-semibold text-stone-500 mb-1.5">
        Allergens
      </label>
      <AllergenPicker selected={selected} onChange={setSelected} />

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="font-body text-xs font-semibold bg-navy text-cream rounded-md px-3 py-1.5"
        >
          {profile ? "Save changes" : "Add profile"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="font-body text-xs font-semibold text-stone-500 border border-stone-300 rounded-md px-3 py-1.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ProfilesManager({ profiles }) {
  const [editingId, setEditingId] = useState(null); // null | "new" | profile.id

  return (
    <div>
      {profiles.map((profile) =>
        editingId === profile.id ? (
          <ProfileForm
            key={profile.id}
            profile={profile}
            onDone={() => setEditingId(null)}
          />
        ) : (
          <div
            key={profile.id}
            className="bg-white border border-stone-200 rounded-lg p-4 mb-3 flex items-start justify-between gap-3"
          >
            <div>
              <p className="font-body font-semibold text-sm text-stone-900 mb-1">
                {profile.name}
              </p>
              {profile.allergens.length === 0 ? (
                <p className="font-body text-xs text-stone-400">
                  No allergens listed
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {profile.allergens.map((a) => (
                    <span
                      key={a}
                      className="font-body text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600"
                    >
                      {allergenLabel(a)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditingId(profile.id)}
                className="font-body text-xs font-semibold text-navy border border-stone-300 rounded-md px-2.5 py-1"
              >
                Edit
              </button>
              <form action={deleteProfile}>
                <input type="hidden" name="id" value={profile.id} />
                <button
                  type="submit"
                  className="font-body text-xs font-semibold text-signred border border-stone-300 rounded-md px-2.5 py-1"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        )
      )}

      {editingId === "new" ? (
        <ProfileForm onDone={() => setEditingId(null)} />
      ) : (
        <button
          type="button"
          onClick={() => setEditingId("new")}
          className="font-body text-sm font-semibold bg-navy text-cream rounded-md px-4 py-2"
        >
          + Add profile
        </button>
      )}
    </div>
  );
}
