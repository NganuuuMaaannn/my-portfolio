do $$
declare
  sample_owner_id uuid;
begin
  select owner_id
  into sample_owner_id
  from public.student_portfolios
  where portfolio_slug = 'student-portfolio'
  limit 1;

  if sample_owner_id is null then
    select auth_user.id
    into sample_owner_id
    from auth.users as auth_user
    left join public.student_portfolios as portfolio
      on portfolio.owner_id = auth_user.id
    where portfolio.owner_id is null
    order by auth_user.created_at asc
    limit 1;
  end if;

  if sample_owner_id is null then
    raise exception
      'No available auth user without a portfolio was found. Create a new account first or manually seed with a specific owner_id.';
  end if;

  insert into public.student_portfolios (
    owner_id,
    portfolio_slug,
    owner_name,
    headline,
    intro,
    about_bio,
    about_image,
    role_title,
    specialty,
    contact_message,
    is_published,
    hero_stats,
    capabilities,
    projects,
    certificates,
    contact_methods
  )
  values (
    sample_owner_id,
    'student-portfolio',
    'Student Name',
    'Building clean digital experiences with story, structure, and strong UI rhythm.',
    'This sample portfolio shows how a published student page can look in Allena Hub. Replace it later with your own data from the admin dashboard.',
    'I am Student Name, a frontend-focused student builder who enjoys turning rough concepts into polished websites and app experiences. My process starts with understanding the audience, organizing the content, and then shaping a clean visual system.',
    '/Sample.png',
    'UI Designer and Frontend Developer',
    'Portfolio sites, admin tools, and modern landing pages.',
    'Reach out for collaboration, internship opportunities, or project work.',
    true,
    '[
      {"value":"06","label":"Projects shipped"},
      {"value":"04","label":"Certificates earned"},
      {"value":"24h","label":"Reply time target"}
    ]'::jsonb,
    '[
      {"title":"Product Thinking","description":"I like mapping user problems before touching the interface so every screen solves a clear job."},
      {"title":"UI Systems","description":"My design process balances layout, typography, and reusable components that stay coherent as features grow."},
      {"title":"Frontend Craft","description":"I build polished interfaces with strong attention to responsive behavior, motion, and readable code structure."},
      {"title":"Team Workflow","description":"I work closely with founders, designers, and developers to ship clear iterations instead of vague big-bang releases."}
    ]'::jsonb,
    '[
      {"title":"Northstar Commerce Dashboard","category":"Web App","year":"2026","summary":"A sales intelligence dashboard for a growing retail team, built to monitor revenue, orders, and campaign performance in one place.","stack":["Next.js","TypeScript","Tailwind","Chart UI"],"href":"https://example.com/projects/northstar-commerce-dashboard","accent":"from-[#0f766e] via-[#14b8a6] to-[#99f6e4]","image":"/project-cover-placeholder.svg"},
      {"title":"PulseFit Mobile Coach","category":"Mobile UX","year":"2026","summary":"A habit-driven fitness app concept with onboarding, personalized routines, and friendly progress feedback for daily motivation.","stack":["React Native","Figma","Health Data","Notifications"],"href":"https://example.com/projects/pulsefit-mobile-coach","accent":"from-[#0f172a] via-[#334155] to-[#cbd5e1]","image":"/project-cover-placeholder.svg"},
      {"title":"Classroom Connect Portal","category":"Education","year":"2025","summary":"A portal for students and teachers to manage assignments, attendance, and announcements with a calm and approachable interface.","stack":["Next.js","Supabase","Role Access","Messaging"],"href":"https://example.com/projects/classroom-connect-portal","accent":"from-[#9a3412] via-[#f97316] to-[#fdba74]","image":"/project-cover-placeholder.svg"}
    ]'::jsonb,
    '[
      {"title":"UX Strategy Foundations","website":"DesignLab Academy","href":"https://example.com/certificates/ux-strategy-foundations","image":"/certificate-ux-strategy.svg","issued":"Issued Jan 2026"},
      {"title":"Frontend Performance Specialist","website":"DevSprint Institute","href":"https://example.com/certificates/frontend-performance-specialist","image":"/certificate-frontend-performance.svg","issued":"Issued Nov 2025"}
    ]'::jsonb,
    '[
      {"label":"Email","value":"hello@student.dev","href":"mailto:hello@student.dev","icon":"email"},
      {"label":"Phone","value":"+63 912 345 6789","href":"tel:+639123456789","icon":"phone"},
      {"label":"Location","value":"Quezon City, Philippines","href":"https://maps.google.com/?q=Quezon+City+Philippines","icon":"location"},
      {"label":"LinkedIn","value":"linkedin.com/in/student-portfolio","href":"https://linkedin.com/in/student-portfolio","icon":"linkedin"},
      {"label":"GitHub","value":"github.com/student-portfolio","href":"https://github.com/student-portfolio","icon":"github"},
      {"label":"Website","value":"student-portfolio.allenahub.app","href":"/student-portfolio","icon":"website"}
    ]'::jsonb
  )
  on conflict (portfolio_slug) do update
  set
    owner_name = excluded.owner_name,
    headline = excluded.headline,
    intro = excluded.intro,
    about_bio = excluded.about_bio,
    about_image = excluded.about_image,
    role_title = excluded.role_title,
    specialty = excluded.specialty,
    contact_message = excluded.contact_message,
    is_published = excluded.is_published,
    hero_stats = excluded.hero_stats,
    capabilities = excluded.capabilities,
    projects = excluded.projects,
    certificates = excluded.certificates,
    contact_methods = excluded.contact_methods,
    updated_at = timezone('utc', now());
end;
$$;
