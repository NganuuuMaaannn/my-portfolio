"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  createPortfolioUpsertPayload,
  getPortfolioPath,
  normalizePortfolioContent,
  sanitizePortfolioSlug,
  validatePortfolioSlug,
} from "@/app/components/portfolio/data";
import {
  contactIconNames,
  type Capability,
  type Certificate,
  type ContactIconName,
  type ContactMethod,
  type HeroStat,
  type PortfolioContent,
  type PortfolioRow,
  type Project,
} from "@/app/components/portfolio/types";
import { createClient } from "@/lib/supabase";

const portfolioTable = "student_portfolios";

type PortfolioEditorProps = {
  userId: string;
  initialPortfolio: PortfolioContent;
  initialErrorMessage?: string | null;
};

type SaveState =
  | {
      kind: "success" | "error";
      message: string;
    }
  | null;

type SectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-teal-400";

const textAreaClassName = `${inputClassName} min-h-32 resize-y`;
const destructiveButtonClassName =
  "rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-400 hover:text-white";
const addButtonClassName =
  "rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600";

export function PortfolioEditor({
  userId,
  initialPortfolio,
  initialErrorMessage,
}: PortfolioEditorProps) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [saveState, setSaveState] = useState<SaveState>(
    initialErrorMessage
      ? {
          kind: "error",
          message:
            "The portfolio table is not ready yet. Run the SQL setup file, then save again.",
        }
      : null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const slugError = useMemo(
    () => validatePortfolioSlug(portfolio.portfolioSlug),
    [portfolio.portfolioSlug],
  );
  const previewPath = getPortfolioPath(portfolio.portfolioSlug || "your-portfolio");

  const updatePortfolioField = <K extends keyof PortfolioContent>(
    field: K,
    value: PortfolioContent[K],
  ) => {
    setPortfolio((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateHeroStat = (
    index: number,
    field: keyof HeroStat,
    value: string,
  ) => {
    setPortfolio((current) => ({
      ...current,
      heroStats: current.heroStats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateCapability = (
    index: number,
    field: keyof Capability,
    value: string,
  ) => {
    setPortfolio((current) => ({
      ...current,
      capabilities: current.capabilities.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[],
  ) => {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateCertificate = (
    index: number,
    field: keyof Certificate,
    value: string,
  ) => {
    setPortfolio((current) => ({
      ...current,
      certificates: current.certificates.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateContactMethod = (
    index: number,
    field: keyof ContactMethod,
    value: string,
  ) => {
    setPortfolio((current) => ({
      ...current,
      contactMethods: current.contactMethods.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "icon" ? (value as ContactIconName) : value,
            }
          : item,
      ),
    }));
  };

  const handleSave = async () => {
    const normalizedSlug = sanitizePortfolioSlug(portfolio.portfolioSlug);
    updatePortfolioField("portfolioSlug", normalizedSlug);

    const nextPortfolio = {
      ...portfolio,
      portfolioSlug: normalizedSlug,
    };

    const nextSlugError = validatePortfolioSlug(normalizedSlug);
    if (nextSlugError) {
      setSaveState({
        kind: "error",
        message: nextSlugError,
      });
      return;
    }

    setIsSaving(true);
    setSaveState(null);

    const supabase = createClient();
    const payload = createPortfolioUpsertPayload(userId, nextPortfolio);
    const { data, error } = await supabase
      .from(portfolioTable)
      .upsert(payload, { onConflict: "owner_id" })
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      setSaveState({
        kind: "error",
        message: error.message,
      });
      return;
    }

    setPortfolio(normalizePortfolioContent(data as Partial<PortfolioRow>));
    setSaveState({
      kind: "success",
      message: "Portfolio saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-teal-300">
              Portfolio Admin
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Edit your public portfolio
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Your public page will be available at
              <a
                href={previewPath}
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-medium text-teal-300 hover:text-teal-200"
              >
                {previewPath}
              </a>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || Boolean(slugError)}
            className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {isSaving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>

        {slugError && (
          <p className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {slugError}
          </p>
        )}

        {saveState && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              saveState.kind === "success"
                ? "border border-teal-500/40 bg-teal-500/10 text-teal-100"
                : "border border-red-500/40 bg-red-500/10 text-red-100"
            }`}
          >
            {saveState.message}
          </p>
        )}

        {initialErrorMessage && (
          <p className="mt-4 rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
            Setup note: apply the SQL file at <code>supabase/student_portfolios.sql</code> before
            saving from the admin. Current database response: {initialErrorMessage}
          </p>
        )}
      </div>

      <SectionCard
        title="Portfolio Settings"
        description="These fields control the student name, the public route, and whether the portfolio is visible to everyone."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Portfolio Slug">
            <input
              value={portfolio.portfolioSlug}
              onChange={(event) =>
                updatePortfolioField("portfolioSlug", sanitizePortfolioSlug(event.target.value))
              }
              className={inputClassName}
              placeholder="sean-portfolio"
            />
          </Field>

          <Field label="Student Name">
            <input
              value={portfolio.ownerName}
              onChange={(event) =>
                updatePortfolioField("ownerName", event.target.value)
              }
              className={inputClassName}
              placeholder="Sean Michael"
            />
          </Field>
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={portfolio.isPublished}
            onChange={(event) =>
              updatePortfolioField("isPublished", event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-teal-400"
          />
          Publish this portfolio publicly
        </label>
      </SectionCard>

      <SectionCard
        title="Hero Copy"
        description="This content appears at the top of the public portfolio page."
      >
        <div className="grid gap-5">
          <Field label="Headline">
            <textarea
              value={portfolio.headline}
              onChange={(event) =>
                updatePortfolioField("headline", event.target.value)
              }
              className={textAreaClassName}
            />
          </Field>

          <Field label="Intro">
            <textarea
              value={portfolio.intro}
              onChange={(event) =>
                updatePortfolioField("intro", event.target.value)
              }
              className={textAreaClassName}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Role Title">
              <input
                value={portfolio.roleTitle}
                onChange={(event) =>
                  updatePortfolioField("roleTitle", event.target.value)
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Specialty">
              <input
                value={portfolio.specialty}
                onChange={(event) =>
                  updatePortfolioField("specialty", event.target.value)
                }
                className={inputClassName}
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="About and Contact"
        description="Use these text blocks to describe the student and add a clear contact invitation."
      >
        <div className="grid gap-5">
          <Field label="About Bio">
            <textarea
              value={portfolio.aboutBio}
              onChange={(event) =>
                updatePortfolioField("aboutBio", event.target.value)
              }
              className={textAreaClassName}
            />
          </Field>

          <Field label="Contact Message">
            <textarea
              value={portfolio.contactMessage}
              onChange={(event) =>
                updatePortfolioField("contactMessage", event.target.value)
              }
              className={textAreaClassName}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Hero Stats"
        description="Short numeric highlights shown in the hero section."
      >
        <div className="space-y-4">
          {portfolio.heroStats.map((item, index) => (
            <div key={`hero-stat-${index}`} className="grid gap-4 rounded-xl border border-slate-700 p-4 md:grid-cols-[0.32fr_0.68fr_auto] md:items-end">
              <Field label="Value">
                <input
                  value={item.value}
                  onChange={(event) =>
                    updateHeroStat(index, "value", event.target.value)
                  }
                  className={inputClassName}
                />
              </Field>

              <Field label="Label">
                <input
                  value={item.label}
                  onChange={(event) =>
                    updateHeroStat(index, "label", event.target.value)
                  }
                  className={inputClassName}
                />
              </Field>

              <button
                type="button"
                onClick={() =>
                  updatePortfolioField(
                    "heroStats",
                    portfolio.heroStats.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className={destructiveButtonClassName}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updatePortfolioField("heroStats", [
                ...portfolio.heroStats,
                { value: "", label: "" },
              ])
            }
            className={addButtonClassName}
          >
            Add Stat
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Capabilities"
        description="Short strengths or skills shown in the about section."
      >
        <div className="space-y-4">
          {portfolio.capabilities.map((item, index) => (
            <div key={`capability-${index}`} className="space-y-4 rounded-xl border border-slate-700 p-4">
              <Field label="Title">
                <input
                  value={item.title}
                  onChange={(event) =>
                    updateCapability(index, "title", event.target.value)
                  }
                  className={inputClassName}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateCapability(index, "description", event.target.value)
                  }
                  className={textAreaClassName}
                />
              </Field>

              <button
                type="button"
                onClick={() =>
                  updatePortfolioField(
                    "capabilities",
                    portfolio.capabilities.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className={destructiveButtonClassName}
              >
                Remove Capability
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updatePortfolioField("capabilities", [
                ...portfolio.capabilities,
                { title: "", description: "" },
              ])
            }
            className={addButtonClassName}
          >
            Add Capability
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Projects"
        description="Add the student’s portfolio work here. Stack values should be comma-separated."
      >
        <div className="space-y-5">
          {portfolio.projects.map((item, index) => (
            <div key={`project-${index}`} className="space-y-4 rounded-xl border border-slate-700 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Title">
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateProject(index, "title", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Category">
                  <input
                    value={item.category}
                    onChange={(event) =>
                      updateProject(index, "category", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Year">
                  <input
                    value={item.year}
                    onChange={(event) =>
                      updateProject(index, "year", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field label="Summary">
                <textarea
                  value={item.summary}
                  onChange={(event) =>
                    updateProject(index, "summary", event.target.value)
                  }
                  className={textAreaClassName}
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Project URL">
                  <input
                    value={item.href}
                    onChange={(event) =>
                      updateProject(index, "href", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Accent Gradient Classes">
                  <input
                    value={item.accent}
                    onChange={(event) =>
                      updateProject(index, "accent", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              <Field label="Tech Stack">
                <input
                  value={item.stack.join(", ")}
                  onChange={(event) =>
                    updateProject(
                      index,
                      "stack",
                      event.target.value
                        .split(",")
                        .map((stackItem) => stackItem.trim())
                        .filter(Boolean),
                    )
                  }
                  className={inputClassName}
                  placeholder="Next.js, TypeScript, Tailwind"
                />
              </Field>

              <button
                type="button"
                onClick={() =>
                  updatePortfolioField(
                    "projects",
                    portfolio.projects.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className={destructiveButtonClassName}
              >
                Remove Project
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updatePortfolioField("projects", [
                ...portfolio.projects,
                {
                  title: "",
                  category: "",
                  year: "",
                  summary: "",
                  stack: [],
                  href: "",
                  accent: "from-[#0f766e] via-[#14b8a6] to-[#99f6e4]",
                },
              ])
            }
            className={addButtonClassName}
          >
            Add Project
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Certificates"
        description="Each certificate can include an image path, issue date, and external link."
      >
        <div className="space-y-5">
          {portfolio.certificates.map((item, index) => (
            <div key={`certificate-${index}`} className="space-y-4 rounded-xl border border-slate-700 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateCertificate(index, "title", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Website">
                  <input
                    value={item.website}
                    onChange={(event) =>
                      updateCertificate(index, "website", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Certificate URL">
                  <input
                    value={item.href}
                    onChange={(event) =>
                      updateCertificate(index, "href", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Image Path">
                  <input
                    value={item.image}
                    onChange={(event) =>
                      updateCertificate(index, "image", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="/certificate-image.svg"
                  />
                </Field>
              </div>

              <Field label="Issued Text">
                <input
                  value={item.issued}
                  onChange={(event) =>
                    updateCertificate(index, "issued", event.target.value)
                  }
                  className={inputClassName}
                />
              </Field>

              <button
                type="button"
                onClick={() =>
                  updatePortfolioField(
                    "certificates",
                    portfolio.certificates.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className={destructiveButtonClassName}
              >
                Remove Certificate
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updatePortfolioField("certificates", [
                ...portfolio.certificates,
                {
                  title: "",
                  website: "",
                  href: "",
                  image: "/certificate-ux-strategy.svg",
                  issued: "",
                },
              ])
            }
            className={addButtonClassName}
          >
            Add Certificate
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Contact Methods"
        description="The first email entry is used as the main call-to-action link."
      >
        <div className="space-y-5">
          {portfolio.contactMethods.map((item, index) => (
            <div key={`contact-method-${index}`} className="space-y-4 rounded-xl border border-slate-700 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Label">
                  <input
                    value={item.label}
                    onChange={(event) =>
                      updateContactMethod(index, "label", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Icon">
                  <select
                    value={item.icon}
                    onChange={(event) =>
                      updateContactMethod(index, "icon", event.target.value)
                    }
                    className={inputClassName}
                  >
                    {contactIconNames.map((iconName) => (
                      <option key={iconName} value={iconName}>
                        {iconName}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Display Value">
                  <input
                    value={item.value}
                    onChange={(event) =>
                      updateContactMethod(index, "value", event.target.value)
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Link URL">
                  <input
                    value={item.href}
                    onChange={(event) =>
                      updateContactMethod(index, "href", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="mailto:hello@example.com"
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={() =>
                  updatePortfolioField(
                    "contactMethods",
                    portfolio.contactMethods.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className={destructiveButtonClassName}
              >
                Remove Contact Method
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updatePortfolioField("contactMethods", [
                ...portfolio.contactMethods,
                {
                  label: "",
                  value: "",
                  href: "",
                  icon: "website",
                },
              ])
            }
            className={addButtonClassName}
          >
            Add Contact Method
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || Boolean(slugError)}
          className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          {isSaving ? "Saving..." : "Save Portfolio"}
        </button>
      </div>
    </div>
  );
}
