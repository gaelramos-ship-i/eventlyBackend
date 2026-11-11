-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Users (
  id_user integer NOT NULL DEFAULT nextval('"Users_id_user_seq"'::regclass),
  name_user character varying NOT NULL,
  email_user character varying NOT NULL UNIQUE,
  pass_user character varying NOT NULL,
  CONSTRAINT Users_pkey PRIMARY KEY (id_user)
);
CREATE TABLE public.Events (
  id_event integer NOT NULL DEFAULT nextval('"Events_id_event_seq"'::regclass),
  name_event character varying NOT NULL,
  type_event character varying,
  address_event character varying NOT NULL,
  description_event text NOT NULL,
  fk_id_user integer NOT NULL,
  date_event date NOT NULL,
  image_event character varying,
  CONSTRAINT Events_pkey PRIMARY KEY (id_event),
  CONSTRAINT fk_events_users1 FOREIGN KEY (fk_id_user) REFERENCES public.Users(id_user)
);
CREATE TABLE public.events_has_users (
  fk_id_event integer NOT NULL,
  fk_id_user integer NOT NULL,
  CONSTRAINT events_has_users_pkey PRIMARY KEY (fk_id_event, fk_id_user),
  CONSTRAINT fk_events_has_users_events FOREIGN KEY (fk_id_event) REFERENCES public.Events(id_event),
  CONSTRAINT fk_events_has_users_users1 FOREIGN KEY (fk_id_user) REFERENCES public.Users(id_user)
);
CREATE TABLE public.PasswordResetTokens (
  id integer NOT NULL DEFAULT nextval('"PasswordResetTokens_id_seq"'::regclass),
  id_user integer NOT NULL,
  token_hash character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used boolean NOT NULL DEFAULT false,
  CONSTRAINT PasswordResetTokens_pkey PRIMARY KEY (id),
  CONSTRAINT PasswordResetTokens_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.Users(id_user)
);