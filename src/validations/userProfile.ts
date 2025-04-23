import vine from "@vinejs/vine";

export const createActorProfile = vine.object({
  body: vine.object({
    profession: vine.enum(["Actor", "Producer"]),
    first_name: vine.string(),
    last_name: vine.string(),
    actual_age: vine.string(),
    playable_age: vine.enum(["18-24", "25-34", "35-54", "56-74"]),
    gender: vine.enum(["male", "female"]),
    skin_type: vine.enum([
      "#FBD7C1",
      "#DDC5A9",
      "#F9E0AA",
      "#D7C9BC",
      "#EDBA85",
      "#E4B48C",
      "#EABD82",
      "#BC9279",
      "#A2876A",
      "#8A5F3E",
      "#AB6A47",
      "#AB6C40",
      "#8F614D",
      "#58361A",
      "#392315"
    ])
  })
});

export const createProducerProfile = vine.object({
  body: vine.object({
    profession: vine.enum(["Actor", "Producer"]),
    first_name: vine.string(),
    last_name: vine.string(),
    film_maker_profile: vine.string(),
    company_name: vine.string(),
    company_email: vine.string(),
    company_phone_number: vine.string(),
    address: vine.string(),
    city: vine.string(),
    state: vine.string(),
    country: vine.string()
  })
});

export const updateUserProfile = vine.object({
  body: vine.object({
    updateData: vine.object({
      first_name: vine.string().optional(),
      last_name: vine.string().optional(),
      actual_age: vine.string().optional(),
      playable_age: vine.enum(["18-24", "25-34", "35-54", "56-74"]).optional(),
      gender: vine.enum(["male", "female"]).optional(),
      skin_type: vine
        .enum([
          "#FBD7C1",
          "#DDC5A9",
          "#F9E0AA",
          "#D7C9BC",
          "#EDBA85",
          "#E4B48C",
          "#EABD82",
          "#BC9279",
          "#A2876A",
          "#8A5F3E",
          "#AB6A47",
          "#AB6C40",
          "#8F614D",
          "#58361A",
          "#392315"
        ])
        .optional(),
      preferred_roles: vine.array(vine.string()).optional(),
      actor_lookalike: vine.array(vine.string()).optional(),
      background_actor: vine.boolean().optional(),
      additional_skills: vine.array(vine.string()).optional(),
      height: vine.string().optional(),
      primary_language: vine.string().optional(),
      other_languages: vine.array(vine.string()).optional(),
      city: vine.string().optional(),
      state: vine.string().optional(),
      country: vine.string().optional(),
      address: vine.string().optional(),
      front_headshot: vine.string().optional(),
      side_headshot: vine.string().optional(),
      link_to_reels: vine.array(vine.string()).optional(),
      recent_projects: vine
        .array(
          vine.object({
            project_name: vine.string().optional(),
            producer: vine.string().optional()
          })
        )
        .optional(),
      awards: vine.array(vine.string()).optional(),
      education: vine.enum(["PHD", "MSC", "HND", "OND", "SSCE", "N/A"]).optional(),
      film_maker_profile: vine.string().optional(),
      company_name: vine.string().optional(),
      company_email: vine.string().optional(),
      company_phone_number: vine.string().optional(),
      profile_picture: vine.string().optional()
    })
  })
});
