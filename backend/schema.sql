--
-- PostgreSQL database dump
--
-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cluster_solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cluster_solutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    theme character varying(50) NOT NULL,
    total_feedbacks integer DEFAULT 0,
    solution_summary text,
    root_cause text,
    quick_fix text,
    long_term_fix text,
    action_steps jsonb,
    priority character varying(20),
    confidence numeric(4,3) DEFAULT 0.000,
    generated_by character varying(30) DEFAULT 'groq'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_generated_at timestamp without time zone,
    last_feedback_at timestamp without time zone,
    status text DEFAULT 'idle'::text NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT cluster_solutions_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))),
    CONSTRAINT cluster_solutions_status_check CHECK ((status = ANY (ARRAY['idle'::text, 'processing'::text, 'failed'::text])))
);


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    theme text,
    themed_at timestamp without time zone,
    theme_status text DEFAULT 'pending'::text NOT NULL,
    theme_updated_at timestamp without time zone,
    theme_error text,
    theme_attempts integer DEFAULT 0 NOT NULL,
    sentiment text,
    confidence numeric(4,3),
    summary text,
    CONSTRAINT feedbacks_theme_status_check CHECK ((theme_status = ANY (ARRAY['pending'::text, 'processing'::text, 'done'::text, 'failed'::text])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: cluster_solutions cluster_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cluster_solutions
    ADD CONSTRAINT cluster_solutions_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cluster_solutions_user_theme_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX cluster_solutions_user_theme_unique ON public.cluster_solutions USING btree (user_id, theme);


--
-- Name: idx_feedbacks_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedbacks_created_at ON public.feedbacks USING btree (created_at);


--
-- Name: idx_feedbacks_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedbacks_user_id ON public.feedbacks USING btree (user_id);


--
-- Name: idx_feedbacks_user_theme_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_feedbacks_user_theme_status ON public.feedbacks USING btree (user_id, theme, theme_status);


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--