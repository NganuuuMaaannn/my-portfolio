"use client";

import Image from "next/image";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

import {
  createPortfolioUpsertPayload,
  getProjectLinkPresentation,
  getPortfolioPath,
  isResumeContactMethod,
  normalizePortfolioContent,
  sanitizePortfolioSlug,
  validatePortfolioSlug,
} from "@/app/components/portfolio/data";
import {
  contactIconNames,
  projectLinkTypes,
  type Certificate,
  type ContactIconName,
  type ContactMethod,
  type HeroContact,
  type PortfolioContent,
  type PortfolioRow,
  type Project,
  type ProjectLinkType,
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

type ToastNotification = {
  id: number;
  title: string;
  message: string;
};

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
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children}
    </label>
  );
}

type ToastProps = {
  notification: ToastNotification;
  onClose: () => void;
};

function Toast({ notification, onClose }: ToastProps) {
  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-teal-400/30 bg-slate-950/95 p-4 shadow-[0_24px_80px_rgba(8,145,178,0.22)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">
            {notification.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-100">{notification.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-teal-400 hover:text-white"
        >
          X
        </button>
      </div>
    </div>
  );
}

type EditorModalProps = {
  open: boolean;
  eyebrow: string;
  title: string;
  description: string;
  onClose: () => void;
  children?: ReactNode;
  footer: ReactNode;
};

function EditorModal({
  open,
  eyebrow,
  title,
  description,
  onClose,
  children,
  footer,
}: EditorModalProps) {
  const hasChildren = children !== null && children !== undefined;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center">
        <div
          className="w-full overflow-hidden rounded-4xl border border-slate-700 bg-slate-900 shadow-[0_30px_120px_rgba(2,6,23,0.72)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-teal-300">{eyebrow}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-50">{title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
              </div>
            </div>
          </div>

          {hasChildren ? (
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto px-6 py-6 sm:px-8">
              {children}
            </div>
          ) : null}

          <div className="px-6 py-5 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-teal-400";

const textAreaClassName = `${inputClassName} min-h-32 resize-y`;
const primaryButtonClassName =
  "rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300";
const savePortfolioButtonClassName =
  "rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300";
const dangerConfirmButtonClassName =
  "rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300";
const destructiveButtonClassName =
  "rounded-xl border border-red-500/40 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-400 hover:text-white";
const addButtonClassName =
  "rounded-xl bg-slate-700 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-600";
const secondaryButtonClassName =
  "rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-teal-400 hover:text-white";
const tileActionButtonClassName =
  "rounded-lg border border-white/15 bg-blue-700/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-700 hover:scale-105 hover:border-teal-300/50 hover:text-white";
const tileDeleteActionButtonClassName =
  "rounded-lg border border-white/15 bg-red-700/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 transition duration-700 hover:scale-105 hover:border-teal-300/50 hover:text-white";
const fileInputClassName =
  "block w-full rounded-xl border border-dashed border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-300 transition file:mr-4 file:rounded-lg file:border-0 file:bg-teal-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:border-teal-400";

const defaultAboutImage = "/profile-portrait.svg";
const defaultProjectImage = "/project-cover-placeholder.svg";
const defaultCertificateImage = "/certificate-ux-strategy.svg";
const defaultProjectAccent = "from-[#0f766e] via-[#14b8a6] to-[#99f6e4]";
const portfolioAssetBucket = "portfolio-images";
const maxImageSizeInBytes = 5 * 1024 * 1024;
const maxPdfSizeInBytes = 10 * 1024 * 1024;
const supportedImageAccept =
  "image/png,image/jpeg,image/webp,image/avif,image/gif";
const supportedPdfAccept = "application/pdf,.pdf";
const supportedImageMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
]);
const supportedPdfMimeTypes = new Set(["application/pdf"]);
const supportedImageExtensions = new Set(["png", "jpg", "jpeg", "webp", "avif", "gif"]);
const projectLinkTypeLabelByValue: Record<ProjectLinkType, string> = {
  live: "Open Live Preview",
  repository: "Open Repository",
  private: "Private Repository",
};

type UploadStatus =
  | {
    key: string;
    kind: "success" | "error";
    message: string;
  }
  | null;

type ImageUploadFieldProps = {
  value: string;
  fallbackSrc: string;
  previewAlt: string;
  placeholder: string;
  previewClassName: string;
  isUploading: boolean;
  status: Omit<NonNullable<UploadStatus>, "key"> | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (value: string) => void;
};

type ProjectTileProps = {
  project: Project;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

type CertificateTileProps = {
  certificate: Certificate;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

type ProjectModalState =
  | {
    mode: "add" | "edit";
    index: number | null;
    draft: Project;
    stackInput: string;
  }
  | null;

type CertificateModalState =
  | {
    mode: "add" | "edit";
    index: number | null;
    draft: Certificate;
  }
  | null;

type ConfirmationAction =
  | { kind: "save-portfolio" }
  | { kind: "save-project" }
  | { kind: "save-certificate" }
  | { kind: "delete-project"; index: number }
  | { kind: "delete-certificate"; index: number };

function createEmptyProject(): Project {
  return {
    title: "",
    category: "",
    year: "",
    summary: "",
    stack: [],
    href: "",
    linkType: "private",
    image: defaultProjectImage,
    accent: defaultProjectAccent,
  };
}

function createEmptyCertificate(): Certificate {
  return {
    title: "",
    website: "",
    href: "",
    image: defaultCertificateImage,
    issued: "",
  };
}

function createEmptyHeroContact(): HeroContact {
  return {
    label: "",
    href: "",
    icon: "website",
  };
}

function cloneProject(project: Project): Project {
  return {
    ...project,
    stack: [...project.stack],
  };
}

function parseTechStackInput(value: string): string[] {
  return value
    .split(",")
    .map((stackItem) => stackItem.trim())
    .filter(Boolean);
}

function stringifyTechStack(stack: string[]): string {
  return stack.join(", ");
}

function cloneCertificate(certificate: Certificate): Certificate {
  return {
    ...certificate,
  };
}

function ImageUploadField({
  value,
  fallbackSrc,
  previewAlt,
  placeholder,
  previewClassName,
  isUploading,
  status,
  onFileChange,
  onValueChange,
}: ImageUploadFieldProps) {
  const previewSrc = value.trim() || fallbackSrc;

  return (
    <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
        <Image
          src={previewSrc}
          alt={previewAlt}
          width={720}
          height={720}
          className={`${previewClassName} h-full w-full object-cover`}
        />
      </div>

      <div className="space-y-3">
        <input
          type="file"
          accept={supportedImageAccept}
          onChange={onFileChange}
          disabled={isUploading}
          className={fileInputClassName}
        />

        <p className="text-xs leading-6 text-slate-400">
          Upload PNG, JPG, GIF, WebP, or AVIF files up to 5 MB. Save the portfolio after the
          upload so the new image URL stays attached to this section.
        </p>

        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className={inputClassName}
          placeholder={placeholder}
        />

        {status && (
          <p
            className={`text-xs leading-6 ${status.kind === "success"
              ? "text-teal-300"
              : "text-red-300"
              }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}

function ProjectTile({
  project,
  isEditing,
  onEdit,
  onDelete,
}: ProjectTileProps) {
  const projectLink = getProjectLinkPresentation(project);

  return (
    <article
      className={`flex h-full flex-col mt-auto overflow-hidden rounded-3xl border shadow-[0_18px_60px_rgba(2,6,23,0.28)] transition ${isEditing
        ? "border-teal-400 bg-slate-800"
        : "border-slate-700 bg-slate-900/70 hover:-translate-y-1 hover:border-teal-300/30"
        }`}
    >
      <div className="group relative overflow-hidden">
        <Image
          src={project.image.trim() || defaultProjectImage}
          alt={`${project.title || "Project"} preview`}
          width={960}
          height={720}
          className="aspect-4/3 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-linear-to-br ${project.accent || defaultProjectAccent} opacity-45 mix-blend-screen`}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/45 to-transparent" />

        <div className="absolute left-4 top-4 flex gap-2">
          <button type="button" onClick={onEdit} className={tileActionButtonClassName}>
            Edit
          </button>
          <button type="button" onClick={onDelete} className={tileDeleteActionButtonClassName}>
            Delete
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="mt-3 text-2xl font-semibold leading-snug">
            {project.title || "Untitled Project"}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="min-h-24 text-sm leading-7 text-slate-300">
          {project.summary || "Add a short summary so this card explains the work clearly."}
        </p>

        <div className="flex flex-wrap gap-2">
          {(project.stack.length > 0 ? project.stack : ["Next.js", "TypeScript"]).map((item) => (
            <span
              key={`${project.title}-${item}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
            >
              {item}
            </span>
          ))}
        </div>

        {projectLink.href ? (
          <a
            href={projectLink.href}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
          >
            {projectLink.label}
            <FaExternalLinkAlt className="text-xs" />
          </a>
        ) : (
          <p className="mt-auto text-sm font-semibold text-red-300">{projectLink.label}</p>
        )}
      </div>
    </article>
  );
}

function CertificateTile({
  certificate,
  isEditing,
  onEdit,
  onDelete,
}: CertificateTileProps) {
  const hasLink = Boolean(certificate.href.trim()) && certificate.href.trim() !== "#";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-3xl border shadow-[0_18px_60px_rgba(2,6,23,0.28)] transition ${isEditing
        ? "border-teal-400 bg-slate-800"
        : "border-slate-700 bg-slate-900/70 hover:-translate-y-1 hover:border-teal-300/30"
        }`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={certificate.image.trim() || defaultCertificateImage}
          alt={certificate.title || "Certificate"}
          width={960}
          height={720}
          className="aspect-4/3 w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex gap-2">
          <button type="button" onClick={onEdit} className={tileActionButtonClassName}>
            Edit
          </button>
          <button type="button" onClick={onDelete} className={tileDeleteActionButtonClassName}>
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{certificate.website || "Certificate Issuer"}</span>
          <span>{certificate.issued || "Issue Date"}</span>
        </div>

        <h3 className="text-2xl font-semibold text-slate-50">
          {certificate.title || "Untitled Certificate"}
        </h3>

        {hasLink ? (
          <a
            href={certificate.href}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
          >
            Open Certificate
            <FaExternalLinkAlt className="text-xs" />
          </a>
        ) : (
          <p className="mt-auto text-xs text-slate-500">Add a certificate URL to open it from the tile.</p>
        )}
      </div>
    </article>
  );
}

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
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [projectModal, setProjectModal] = useState<ProjectModalState>(null);
  const [certificateModal, setCertificateModal] = useState<CertificateModalState>(null);
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction | null>(null);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);

  const slugError = useMemo(
    () => validatePortfolioSlug(portfolio.portfolioSlug),
    [portfolio.portfolioSlug],
  );
  const previewPath = getPortfolioPath(portfolio.portfolioSlug || "your-portfolio");
  const resumeContactIndex = useMemo(
    () =>
      portfolio.contactMethods.findIndex((item) => isResumeContactMethod(item)),
    [portfolio.contactMethods],
  );
  const resumeContact =
    resumeContactIndex >= 0 ? portfolio.contactMethods[resumeContactIndex] : null;
  const visibleContactMethods = useMemo(
    () =>
      portfolio.contactMethods
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !isResumeContactMethod(item)),
    [portfolio.contactMethods],
  );

  useEffect(() => {
    if (!toastNotification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastNotification((current) =>
        current?.id === toastNotification.id ? null : current,
      );
    }, 3600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastNotification]);

  const updatePortfolioField = <K extends keyof PortfolioContent>(
    field: K,
    value: PortfolioContent[K],
  ) => {
    setPortfolio((current) => ({
      ...current,
      [field]: value,
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

  const updateHeroContact = (
    index: number,
    field: keyof HeroContact,
    value: string,
  ) => {
    setPortfolio((current) => ({
      ...current,
      heroContacts: current.heroContacts.map((item, itemIndex) =>
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

  const upsertResumeContact = (updates: Partial<ContactMethod>) => {
    setPortfolio((current) => {
      const currentIndex = current.contactMethods.findIndex((item) =>
        isResumeContactMethod(item),
      );
      const existingContact =
        currentIndex >= 0 ? current.contactMethods[currentIndex] : null;
      const nextResumeContact: ContactMethod = {
        label: "View CV",
        value: existingContact?.value || "CV PDF",
        href: existingContact?.href || "#",
        ...existingContact,
        ...updates,
        icon: "website",
        kind: "resume",
      };

      if (currentIndex === -1) {
        return {
          ...current,
          contactMethods: [...current.contactMethods, nextResumeContact],
        };
      }

      return {
        ...current,
        contactMethods: current.contactMethods.map((item, itemIndex) =>
          itemIndex === currentIndex ? nextResumeContact : item,
        ),
      };
    });
  };

  const removeResumeContact = () => {
    updatePortfolioField(
      "contactMethods",
      portfolio.contactMethods.filter((item) => !isResumeContactMethod(item)),
    );
    clearScopedUploadState("resume");
    showSuccessToast("CV removed from your draft.");
  };

  const getFieldUploadStatus = (key: string) =>
    uploadStatus?.key === key
      ? {
        kind: uploadStatus.kind,
        message: uploadStatus.message,
      }
      : null;

  const showSuccessToast = (message: string) => {
    setToastNotification({
      id: Date.now(),
      title: "Success",
      message,
    });
  };

  const closeToast = () => {
    setToastNotification(null);
  };

  const clearScopedUploadState = (scopeKey: string) => {
    setUploadStatus((current) =>
      current?.key.startsWith(scopeKey) ? null : current,
    );
    setUploadingKey((current) =>
      current?.startsWith(scopeKey) ? null : current,
    );
  };

  const closeConfirmation = () => {
    setConfirmationAction(null);
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    options: {
      key: string;
      scope: "about" | "projects" | "certificates";
      onUploaded: (publicUrl: string) => void;
    },
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasSupportedMimeType = supportedImageMimeTypes.has(file.type);
    const hasSupportedExtension = supportedImageExtensions.has(extension);

    if (!hasSupportedMimeType && !hasSupportedExtension) {
      setUploadStatus({
        key: options.key,
        kind: "error",
        message: "Use PNG, JPG, GIF, WebP, or AVIF images only.",
      });
      return;
    }

    if (file.size > maxImageSizeInBytes) {
      setUploadStatus({
        key: options.key,
        kind: "error",
        message: "Image is too large. Keep uploads under 5 MB.",
      });
      return;
    }

    const safeFileName =
      sanitizePortfolioSlug(file.name.replace(/\.[^.]+$/, "")) || options.scope;
    const uniquePath = `${userId}/${options.scope}/${Date.now()}-${crypto.randomUUID()}-${safeFileName}.${extension || "jpg"}`;

    setUploadingKey(options.key);
    setUploadStatus(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(portfolioAssetBucket)
        .upload(uniquePath, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from(portfolioAssetBucket)
        .getPublicUrl(uniquePath);

      options.onUploaded(data.publicUrl);
      setUploadStatus({
        key: options.key,
        kind: "success",
        message: "Image uploaded. Save Portfolio to keep this new image URL.",
      });
      showSuccessToast(
        options.scope === "about"
          ? "About image uploaded successfully."
          : options.scope === "projects"
            ? "Project image uploaded successfully."
            : "Certificate image uploaded successfully.",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Image upload failed.";

      setUploadStatus({
        key: options.key,
        kind: "error",
        message: `${errorMessage} Run the updated SQL setup if the storage bucket is missing.`,
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const handlePdfUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    options: {
      key: string;
      onUploaded: (publicUrl: string, fileName: string) => void;
    },
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const hasSupportedMimeType = supportedPdfMimeTypes.has(file.type);

    if (!hasSupportedMimeType && extension !== "pdf") {
      setUploadStatus({
        key: options.key,
        kind: "error",
        message: "Use PDF files only for the View CV button.",
      });
      return;
    }

    if (file.size > maxPdfSizeInBytes) {
      setUploadStatus({
        key: options.key,
        kind: "error",
        message: "PDF is too large. Keep uploads under 10 MB.",
      });
      return;
    }

    const safeFileName = sanitizePortfolioSlug(file.name.replace(/\.[^.]+$/, "")) || "cv";
    const uniquePath = `${userId}/resume/${Date.now()}-${crypto.randomUUID()}-${safeFileName}.pdf`;

    setUploadingKey(options.key);
    setUploadStatus(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(portfolioAssetBucket)
        .upload(uniquePath, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: "application/pdf",
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from(portfolioAssetBucket)
        .getPublicUrl(uniquePath);

      options.onUploaded(data.publicUrl, file.name);
      setUploadStatus({
        key: options.key,
        kind: "success",
        message: "PDF uploaded. Save Portfolio to keep this View CV file attached.",
      });
      showSuccessToast("CV PDF uploaded successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "PDF upload failed.";

      setUploadStatus({
        key: options.key,
        kind: "error",
        message: `${errorMessage} Run the updated SQL setup if the storage bucket is missing.`,
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const openAddProjectModal = () => {
    clearScopedUploadState("project-modal");
    const draft = createEmptyProject();

    setProjectModal({
      mode: "add",
      index: null,
      draft,
      stackInput: stringifyTechStack(draft.stack),
    });
  };

  const openEditProjectModal = (index: number) => {
    const project = portfolio.projects[index];
    if (!project) {
      return;
    }

    clearScopedUploadState("project-modal");
    const draft = cloneProject(project);

    setProjectModal({
      mode: "edit",
      index,
      draft,
      stackInput: stringifyTechStack(draft.stack),
    });
  };

  const closeProjectModal = () => {
    clearScopedUploadState("project-modal");
    setProjectModal(null);
  };

  const updateProjectDraft = (field: keyof Project, value: string | string[]) => {
    setProjectModal((current) =>
      current
        ? {
          ...current,
          ...(field === "stack"
            ? { stackInput: stringifyTechStack(value as string[]) }
            : {}),
          draft: {
            ...current.draft,
            [field]: value,
          },
        }
        : current,
    );
  };

  const updateProjectStackInput = (value: string) => {
    setProjectModal((current) =>
      current
        ? {
          ...current,
          stackInput: value,
          draft: {
            ...current.draft,
            stack: parseTechStackInput(value),
          },
        }
        : current,
    );
  };

  const handleSaveProjectModal = () => {
    if (!projectModal) {
      return;
    }

    const successMessage =
      projectModal.mode === "edit"
        ? "Project changes saved to your draft."
        : "Project added to your draft.";

    setPortfolio((current) => {
      if (projectModal.mode === "edit" && projectModal.index !== null) {
        return {
          ...current,
          projects: current.projects.map((item, itemIndex) =>
            itemIndex === projectModal.index ? cloneProject(projectModal.draft) : item,
          ),
        };
      }

      return {
        ...current,
        projects: [...current.projects, cloneProject(projectModal.draft)],
      };
    });

    closeProjectModal();
    showSuccessToast(successMessage);
  };

  const requestSaveProjectModal = () => {
    if (!projectModal) {
      return;
    }

    setConfirmationAction({ kind: "save-project" });
  };

  const handleRemoveProject = (index: number) => {
    const projectTitle = portfolio.projects[index]?.title || "Project";

    updatePortfolioField(
      "projects",
      portfolio.projects.filter((_, itemIndex) => itemIndex !== index),
    );
    showSuccessToast(`"${projectTitle}" removed from projects.`);
  };

  const requestRemoveProject = (index: number) => {
    if (!portfolio.projects[index]) {
      return;
    }

    setConfirmationAction({
      kind: "delete-project",
      index,
    });
  };

  const openAddCertificateModal = () => {
    clearScopedUploadState("certificate-modal");
    setCertificateModal({
      mode: "add",
      index: null,
      draft: createEmptyCertificate(),
    });
  };

  const openEditCertificateModal = (index: number) => {
    const certificate = portfolio.certificates[index];
    if (!certificate) {
      return;
    }

    clearScopedUploadState("certificate-modal");
    setCertificateModal({
      mode: "edit",
      index,
      draft: cloneCertificate(certificate),
    });
  };

  const closeCertificateModal = () => {
    clearScopedUploadState("certificate-modal");
    setCertificateModal(null);
  };

  const updateCertificateDraft = (field: keyof Certificate, value: string) => {
    setCertificateModal((current) =>
      current
        ? {
          ...current,
          draft: {
            ...current.draft,
            [field]: value,
          },
        }
        : current,
    );
  };

  const handleSaveCertificateModal = () => {
    if (!certificateModal) {
      return;
    }

    const successMessage =
      certificateModal.mode === "edit"
        ? "Certificate changes saved to your draft."
        : "Certificate added to your draft.";

    setPortfolio((current) => {
      if (certificateModal.mode === "edit" && certificateModal.index !== null) {
        return {
          ...current,
          certificates: current.certificates.map((item, itemIndex) =>
            itemIndex === certificateModal.index
              ? cloneCertificate(certificateModal.draft)
              : item,
          ),
        };
      }

      return {
        ...current,
        certificates: [
          ...current.certificates,
          cloneCertificate(certificateModal.draft),
        ],
      };
    });

    closeCertificateModal();
    showSuccessToast(successMessage);
  };

  const requestSaveCertificateModal = () => {
    if (!certificateModal) {
      return;
    }

    setConfirmationAction({ kind: "save-certificate" });
  };

  const handleRemoveCertificate = (index: number) => {
    const certificateTitle = portfolio.certificates[index]?.title || "Certificate";

    updatePortfolioField(
      "certificates",
      portfolio.certificates.filter((_, itemIndex) => itemIndex !== index),
    );
    showSuccessToast(`"${certificateTitle}" removed from certificates.`);
  };

  const requestRemoveCertificate = (index: number) => {
    if (!portfolio.certificates[index]) {
      return;
    }

    setConfirmationAction({
      kind: "delete-certificate",
      index,
    });
  };

  const requestSavePortfolio = () => {
    setConfirmationAction({ kind: "save-portfolio" });
  };

  const handleAddHeroContact = () => {
    updatePortfolioField("heroContacts", [
      ...portfolio.heroContacts,
      createEmptyHeroContact(),
    ]);
    showSuccessToast("Hero contact added to your draft.");
  };

  const handleRemoveHeroContact = (index: number) => {
    const heroContactLabel = portfolio.heroContacts[index]?.label || "Hero contact";

    updatePortfolioField(
      "heroContacts",
      portfolio.heroContacts.filter((_, itemIndex) => itemIndex !== index),
    );
    showSuccessToast(`"${heroContactLabel}" removed from hero contacts.`);
  };

  const handleAddContactMethod = () => {
    updatePortfolioField("contactMethods", [
      ...portfolio.contactMethods,
      {
        label: "",
        value: "",
        href: "",
        icon: "website",
        kind: "contact",
      },
    ]);
    showSuccessToast("Contact method added to your draft.");
  };

  const handleRemoveContactMethod = (index: number) => {
    const contactLabel = portfolio.contactMethods[index]?.label || "Contact method";

    updatePortfolioField(
      "contactMethods",
      portfolio.contactMethods.filter((_, itemIndex) => itemIndex !== index),
    );
    showSuccessToast(`"${contactLabel}" removed from contact methods.`);
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
    setSaveState(null);
    showSuccessToast("Portfolio saved successfully.");
  };

  const handleConfirmAction = async () => {
    if (!confirmationAction) {
      return;
    }

    const action = confirmationAction;
    closeConfirmation();

    switch (action.kind) {
      case "save-portfolio":
        await handleSave();
        return;
      case "save-project":
        handleSaveProjectModal();
        return;
      case "save-certificate":
        handleSaveCertificateModal();
        return;
      case "delete-project":
        handleRemoveProject(action.index);
        return;
      case "delete-certificate":
        handleRemoveCertificate(action.index);
        return;
      default:
        return;
    }
  };

  const confirmationContent = (() => {
    if (!confirmationAction) {
      return null;
    }

    switch (confirmationAction.kind) {
      case "save-portfolio":
        return {
          eyebrow: "Confirm Save",
          title: "Save portfolio?",
          description:
            "This will save your latest portfolio changes and update the public portfolio data.",
          confirmLabel: "Yes, Save",
          confirmClassName: primaryButtonClassName,
        };
      case "save-project":
        return {
          eyebrow: projectModal?.mode === "edit" ? "Confirm Project Save" : "Confirm Project Add",
          title: projectModal?.mode === "edit" ? "Save project changes?" : "Add this project?",
          description:
            projectModal?.mode === "edit"
              ? "This will apply the project edits to your portfolio draft."
              : "This will add the new project to your portfolio draft.",
          confirmLabel: projectModal?.mode === "edit" ? "Yes, Save" : "Yes, Add",
          confirmClassName: primaryButtonClassName,
        };
      case "save-certificate":
        return {
          eyebrow:
            certificateModal?.mode === "edit"
              ? "Confirm Certificate Save"
              : "Confirm Certificate Add",
          title:
            certificateModal?.mode === "edit"
              ? "Save certificate changes?"
              : "Add this certificate?",
          description:
            certificateModal?.mode === "edit"
              ? "This will apply the certificate edits to your portfolio draft."
              : "This will add the new certificate to your portfolio draft.",
          confirmLabel: certificateModal?.mode === "edit" ? "Yes, Save" : "Yes, Add",
          confirmClassName: primaryButtonClassName,
        };
      case "delete-project":
        return {
          eyebrow: "Confirm Delete",
          title: "Delete this project?",
          description: `This will remove "${portfolio.projects[confirmationAction.index]?.title || "Untitled Project"}" from your portfolio draft.`,
          confirmLabel: "Yes, Delete",
          confirmClassName: dangerConfirmButtonClassName,
        };
      case "delete-certificate":
        return {
          eyebrow: "Confirm Delete",
          title: "Delete this certificate?",
          description: `This will remove "${portfolio.certificates[confirmationAction.index]?.title || "Untitled Certificate"}" from your portfolio draft.`,
          confirmLabel: "Yes, Delete",
          confirmClassName: dangerConfirmButtonClassName,
        };
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-6">
      {toastNotification ? (
        <div className="pointer-events-none fixed right-4 top-4 z-70 w-full max-w-sm sm:right-6 sm:top-6">
          <Toast notification={toastNotification} onClose={closeToast} />
        </div>
      ) : null}

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
            onClick={requestSavePortfolio}
            disabled={isSaving || Boolean(slugError)}
            className={savePortfolioButtonClassName}
          >
            {isSaving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>

        {slugError && (
          <p className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {slugError}
          </p>
        )}

        {saveState?.kind === "error" && (
          <p
            className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
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
        <Field label="Portfolio Slug">
          <input
            value={portfolio.portfolioSlug}
            onChange={(event) =>
              updatePortfolioField("portfolioSlug", sanitizePortfolioSlug(event.target.value))
            }
            className={inputClassName}
            placeholder="Enter domain name here... (example: jenimel-pineda-portfolio)"
          />
        </Field>

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
        description="This content appears at the top of the public portfolio page, including the View CV button."
      >
        <div className="grid gap-5">
          <Field label="Student Name">
            <input
              value={portfolio.ownerName}
              onChange={(event) =>
                updatePortfolioField("ownerName", event.target.value)
              }
              className={inputClassName}
              placeholder="Your name here... (example: Jenimel Pineda)"
            />
          </Field>
          <Field label="Role Title">
            <input
              value={portfolio.roleTitle}
              onChange={(event) =>
                updatePortfolioField("roleTitle", event.target.value)
              }
              className={inputClassName}
              placeholder="Your role title here... (example: Full-Stack Developer | UX Designer)"
            />
          </Field>

          <Field label="View CV PDF">
            <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
              <input
                type="file"
                accept={supportedPdfAccept}
                onChange={(event) =>
                  void handlePdfUpload(event, {
                    key: "resume",
                    onUploaded: (publicUrl, fileName) =>
                      upsertResumeContact({
                        href: publicUrl,
                        value: fileName,
                        label: "View CV",
                      }),
                  })
                }
                disabled={uploadingKey === "resume"}
                className={fileInputClassName}
              />

              <p className="text-xs leading-6 text-slate-400">
                Upload a PDF up to 10 MB, or paste a direct PDF URL below. This file powers the
                View CV button in the hero section.
              </p>

              <input
                value={
                  resumeContact && resumeContact.href !== "#"
                    ? resumeContact.href
                    : ""
                }
                onChange={(event) =>
                  upsertResumeContact({
                    href: event.target.value,
                    value: resumeContact?.value || "CV PDF",
                    label: "View CV",
                  })
                }
                className={inputClassName}
                placeholder="https://your-storage-link.example.com/your-cv.pdf"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {resumeContact && resumeContact.href.trim() && resumeContact.href !== "#" ? (
                  <a
                    href={resumeContact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-teal-300 transition hover:text-teal-200"
                  >
                    Open current CV
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">
                    No CV file connected yet.
                  </p>
                )}

                {resumeContact ? (
                  <button
                    type="button"
                    onClick={removeResumeContact}
                    className={destructiveButtonClassName}
                  >
                    Remove CV
                  </button>
                ) : null}
              </div>

              {getFieldUploadStatus("resume") ? (
                <p
                  className={`text-xs leading-6 ${getFieldUploadStatus("resume")?.kind === "success"
                    ? "text-teal-300"
                    : "text-red-300"
                    }`}
                >
                  {getFieldUploadStatus("resume")?.message}
                </p>
              ) : null}
            </div>
          </Field>

        </div>

        <div className="space-y-5 mt-5">
          <h1 className="text-xl font-semibold text-slate-50">Hero Contact Links</h1>
          {portfolio.heroContacts.map((item, index) => (
            <div key={`hero-contact-${index}`} className="space-y-4 rounded-xl border border-slate-700 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Label">
                  <input
                    value={item.label}
                    onChange={(event) =>
                      updateHeroContact(index, "label", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="GitHub"
                  />
                </Field>

                <Field label="Icon">
                  <select
                    value={item.icon}
                    onChange={(event) =>
                      updateHeroContact(index, "icon", event.target.value)
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

              <Field label="Link URL">
                <input
                  value={item.href}
                  onChange={(event) =>
                    updateHeroContact(index, "href", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="https://github.com/username"
                />
              </Field>

              <button
                type="button"
                onClick={() => handleRemoveHeroContact(index)}
                className={destructiveButtonClassName}
              >
                Remove Hero Contact
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleAddHeroContact}
              className={`${addButtonClassName} w-full sm:w-auto`}
            >
              Add Hero Contact
            </button>
            <button
              type="button"
              onClick={requestSavePortfolio}
              disabled={isSaving || Boolean(slugError)}
              className={`${savePortfolioButtonClassName} w-full sm:w-auto`}
            >
              {isSaving ? "Saving..." : "Save Portfolio"}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="About and Contact"
        description="Use these fields to describe the student, upload the about image, and add a clear contact invitation."
      >
        <div className="grid gap-5">
          <Field label="About Bio">
            <textarea
              value={portfolio.aboutBio}
              onChange={(event) =>
                updatePortfolioField("aboutBio", event.target.value)
              }
              className={textAreaClassName}
              placeholder="Enter about yourself... (example: I'm a recent graduate from the University of XYZ with a passion for creating intuitive user experiences. My background in computer science and design allows me to build projects that are both functional and visually appealing. I'm excited to share my work and connect with others in the industry.)"
            />
          </Field>

          <Field label="About Image">
            <ImageUploadField
              value={portfolio.aboutImage}
              onValueChange={(value) => updatePortfolioField("aboutImage", value)}
              onFileChange={(event) =>
                void handleImageUpload(event, {
                  key: "about",
                  scope: "about",
                  onUploaded: (publicUrl) =>
                    updatePortfolioField("aboutImage", publicUrl),
                })
              }
              fallbackSrc={defaultAboutImage}
              previewAlt={`${portfolio.ownerName || "Student"} portrait`}
              placeholder="/profile-portrait.svg"
              previewClassName="aspect-[4/5]"
              isUploading={uploadingKey === "about"}
              status={getFieldUploadStatus("about")}
            />
          </Field>
        </div>
        <div className="mt-5 ml-auto justify-end flex items-center gap-3">
          <button
            type="button"
            onClick={requestSavePortfolio}
            disabled={isSaving || Boolean(slugError)}
            className={savePortfolioButtonClassName}
          >
            {isSaving ? "Saving..." : "Save Portfolio"}
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Projects"
        description="Manage project cards here. The tiles mirror the live portfolio layout, and stack values should be comma-separated."
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-400">
              Use each tile for quick actions, then edit project details in a modal.
            </p>
            <button type="button" onClick={openAddProjectModal} className={addButtonClassName}>
              Add Project
            </button>
          </div>

          {portfolio.projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.projects.map((item, index) => (
                <ProjectTile
                  key={`project-${index}`}
                  project={item}
                  isEditing={projectModal?.mode === "edit" && projectModal.index === index}
                  onEdit={() => openEditProjectModal(index)}
                  onDelete={() => requestRemoveProject(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/60 px-5 py-10 text-center text-sm text-slate-400">
              No projects yet. Add one to create the first project tile.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Certificates"
        description="Manage certificate cards here with tile actions and image upload support."
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-400">
              Use each tile for quick actions, then edit certificate details in a modal.
            </p>
            <button
              type="button"
              onClick={openAddCertificateModal}
              className={addButtonClassName}
            >
              Add Certificate
            </button>
          </div>

          {portfolio.certificates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.certificates.map((item, index) => (
                <CertificateTile
                  key={`certificate-${index}`}
                  certificate={item}
                  isEditing={
                    certificateModal?.mode === "edit" && certificateModal.index === index
                  }
                  onEdit={() => openEditCertificateModal(index)}
                  onDelete={() => requestRemoveCertificate(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/60 px-5 py-10 text-center text-sm text-slate-400">
              No certificates yet. Add one to create the first certificate tile.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Contact Methods"
        description="These links appear in the contact section. The View CV file is managed above in Hero Copy."
      >
        <div className="space-y-5">
          {visibleContactMethods.map(({ item, index }) => (
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
                onClick={() => handleRemoveContactMethod(index)}
                className={destructiveButtonClassName}
              >
                Remove Contact Method
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleAddContactMethod}
              className={`${addButtonClassName} w-full sm:w-auto`}
            >
              Add Contact Method
            </button>
            <button
              type="button"
              onClick={requestSavePortfolio}
              disabled={isSaving || Boolean(slugError)}
              className={`${savePortfolioButtonClassName} w-full sm:w-auto`}
            >
              {isSaving ? "Saving..." : "Save Portfolio"}
            </button>
          </div>
        </div>
      </SectionCard>

      <EditorModal
        open={projectModal !== null && confirmationAction?.kind !== "save-project"}
        eyebrow={projectModal?.mode === "edit" ? "Editing Project" : "New Project"}
        title={projectModal?.draft.title || "Untitled Project"}
        description="Update the project details here, then save the modal to stage the changes before saving the full portfolio."
        onClose={closeProjectModal}
        footer={
          <>
            <button
              type="button"
              onClick={requestSaveProjectModal}
              className={primaryButtonClassName}
            >
              {projectModal?.mode === "edit" ? "Save Project Changes" : "Add Project"}
            </button>
            <button
              type="button"
              onClick={closeProjectModal}
              className={secondaryButtonClassName}
            >
              Cancel
            </button>
          </>
        }
      >
        {projectModal ? (
          <div className="space-y-5">
            <Field label="Title">
              <input
                value={projectModal.draft.title}
                onChange={(event) => updateProjectDraft("title", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Summary">
              <textarea
                value={projectModal.draft.summary}
                onChange={(event) => updateProjectDraft("summary", event.target.value)}
                className={textAreaClassName}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project Link Type">
                <select
                  value={projectModal.draft.linkType}
                  onChange={(event) =>
                    updateProjectDraft("linkType", event.target.value as ProjectLinkType)
                  }
                  className={inputClassName}
                >
                  {projectLinkTypes.map((linkType) => (
                    <option key={linkType} value={linkType}>
                      {projectLinkTypeLabelByValue[linkType]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Project URL">
                <input
                  value={projectModal.draft.href}
                  onChange={(event) => updateProjectDraft("href", event.target.value)}
                  className={inputClassName}
                  placeholder={
                    projectModal.draft.linkType === "repository"
                      ? "https://github.com/username/repository"
                      : projectModal.draft.linkType === "live"
                        ? "https://your-live-preview.vercel.app"
                        : "Leave blank for a private repository"
                  }
                />
              </Field>
            </div>

            <Field label="Project Image">
              <ImageUploadField
                value={projectModal.draft.image}
                onValueChange={(value) => updateProjectDraft("image", value)}
                onFileChange={(event) =>
                  void handleImageUpload(event, {
                    key: "project-modal",
                    scope: "projects",
                    onUploaded: (publicUrl) => updateProjectDraft("image", publicUrl),
                  })
                }
                fallbackSrc={defaultProjectImage}
                previewAlt={`${projectModal.draft.title || "Project"} preview`}
                placeholder="/project-cover-placeholder.svg"
                previewClassName="aspect-[4/3]"
                isUploading={uploadingKey === "project-modal"}
                status={getFieldUploadStatus("project-modal")}
              />
            </Field>

            <Field label="Tech Stack">
              <input
                value={projectModal.stackInput}
                onChange={(event) => updateProjectStackInput(event.target.value)}
                className={inputClassName}
                placeholder="Next.js, TypeScript, Tailwind"
              />
            </Field>
          </div>
        ) : null}
      </EditorModal>

      <EditorModal
        open={certificateModal !== null && confirmationAction?.kind !== "save-certificate"}
        eyebrow={certificateModal?.mode === "edit" ? "Editing Certificate" : "New Certificate"}
        title={certificateModal?.draft.title || "Untitled Certificate"}
        description="Update the certificate details here, then save the modal to stage the changes before saving the full portfolio."
        onClose={closeCertificateModal}
        footer={
          <>
            <button
              type="button"
              onClick={requestSaveCertificateModal}
              className={primaryButtonClassName}
            >
              {certificateModal?.mode === "edit"
                ? "Save Certificate Changes"
                : "Add Certificate"}
            </button>
            <button
              type="button"
              onClick={closeCertificateModal}
              className={secondaryButtonClassName}
            >
              Cancel
            </button>
          </>
        }
      >
        {certificateModal ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={certificateModal.draft.title}
                  onChange={(event) => updateCertificateDraft("title", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Website">
                <input
                  value={certificateModal.draft.website}
                  onChange={(event) => updateCertificateDraft("website", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Certificate URL">
                <input
                  value={certificateModal.draft.href}
                  onChange={(event) => updateCertificateDraft("href", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Issued Text">
                <input
                  value={certificateModal.draft.issued}
                  onChange={(event) => updateCertificateDraft("issued", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Certificate Image">
              <ImageUploadField
                value={certificateModal.draft.image}
                onValueChange={(value) => updateCertificateDraft("image", value)}
                onFileChange={(event) =>
                  void handleImageUpload(event, {
                    key: "certificate-modal",
                    scope: "certificates",
                    onUploaded: (publicUrl) => updateCertificateDraft("image", publicUrl),
                  })
                }
                fallbackSrc={defaultCertificateImage}
                previewAlt={certificateModal.draft.title || "Certificate preview"}
                placeholder="/certificate-ux-strategy.svg"
                previewClassName="aspect-[4/3]"
                isUploading={uploadingKey === "certificate-modal"}
                status={getFieldUploadStatus("certificate-modal")}
              />
            </Field>
          </div>
        ) : null}
      </EditorModal>

      <EditorModal
        open={confirmationContent !== null}
        eyebrow={confirmationContent?.eyebrow || "Confirm Action"}
        title={confirmationContent?.title || "Are you sure?"}
        description={confirmationContent?.description || "Choose yes or no to continue."}
        onClose={closeConfirmation}
        footer={
          <>
            <button
              type="button"
              onClick={() => void handleConfirmAction()}
              className={confirmationContent?.confirmClassName || primaryButtonClassName}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : confirmationContent?.confirmLabel || "Yes"}
            </button>
            <button
              type="button"
              onClick={closeConfirmation}
              className={secondaryButtonClassName}
            >
              No
            </button>
          </>
        }
      />

      {/* <div className="flex justify-end">
        <button
          type="button"
          onClick={requestSavePortfolio}
          disabled={isSaving || Boolean(slugError)}
          className={savePortfolioButtonClassName}
        >
          {isSaving ? "Saving..." : "Save Portfolio"}
        </button>
      </div> */}
    </div>
  );
}
