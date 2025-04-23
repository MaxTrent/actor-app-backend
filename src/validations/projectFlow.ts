import vine from "@vinejs/vine";

// Project validations
export const createNewProject = vine.object({
  body: vine.object({
    project_name: vine.string(),
    producer: vine.string(),
    description: vine.string()
  })
});

export const getAllProjects = vine.object({
  params: vine.object({
    producer_id: vine.string()
  })
});

export const getProject = vine.object({
  params: vine.object({
    project_id: vine.string()
  })
});

export const updateProject = vine.object({
  body: vine.object({
    project_id: vine.string().optional(),
    thumbnail: vine.string().optional(),
    project_name: vine.string().optional(),
    description: vine.string().optional()
  })
});

export const deleteProject = vine.object({
  body: vine.object({
    project_id: vine.string()
  })
});

export const publishProject = vine.object({
  body: vine.object({
    project_id: vine.string(),
    producer_id: vine.string(),
    cast_start: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    cast_end: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
});

// Role validations
export const createNewRole = vine.object({
  body: vine.object({
    role_name: vine.string(),
    project_id: vine.string()
  })
});

export const getAllRoles = vine.object({
  params: vine.object({
    project_id: vine.string()
  })
});

export const getRole = vine.object({
  params: vine.object({
    role_id: vine.string()
  })
});

export const updateRole = vine.object({
  body: vine.object({
    role_id: vine.string(),
    updateData: vine.object({
      role_name: vine.string().optional(),
      gender: vine.enum(["male", "female", "both"]).optional(),
      avg_rating: vine.number().min(1).max(5).optional(),
      country: vine.string().optional(),
      actor_lookalike: vine.string().optional(),
      endorsement: vine.enum(["most endorsed", "least endorsed"]).optional(),
      category: vine.string().optional(),
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
      distance: vine.number().optional(),
      playable_age: vine
        .string()
        .regex(/^\d{2}-\d{2}$/)
        .optional(),
      height: vine.string().optional(),
      cast_start: vine
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      cast_end: vine
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
    })
  })
});

export const deleteRole = vine.object({
  body: vine.object({
    role_id: vine.string()
  })
});

// Monologue script validations

export const createMonologueScriptByProjectId = vine.object({
  body: vine.object({
    project_id: vine.string(),
    title: vine.string(),
    script: vine.string()
  })
});

export const createMonologueScriptByRoleId = vine.object({
  body: vine.object({
    role_id: vine.string(),
    title: vine.string(),
    script: vine.string()
  })
});

export const getMonologueScriptByProjectId = vine.object({
  params: vine.object({
    project_id: vine.string()
  })
});

export const getMonologueScriptByRoleId = vine.object({
  params: vine.object({
    role_id: vine.string()
  })
});
