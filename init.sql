-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;
-- public.brand definition

-- Drop table

-- DROP TABLE public.brand;

CREATE TABLE public.brand (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	description varchar NOT NULL,
	image_path varchar NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT brand_pkey PRIMARY KEY (id)
);


-- public.bundle definition

-- Drop table

-- DROP TABLE public.bundle;

CREATE TABLE public.bundle (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	image_path varchar NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	discount_percent int4 NOT NULL,
	CONSTRAINT bundle_pkey PRIMARY KEY (id)
);


-- public.category definition

-- Drop table

-- DROP TABLE public.category;

CREATE TABLE public.category (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT category_pkey PRIMARY KEY (id)
);


-- public.tag definition

-- Drop table

-- DROP TABLE public.tag;

CREATE TABLE public.tag (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	CONSTRAINT tag_pkey PRIMARY KEY (id)
);


-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	lastname varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	phone_number varchar NULL,
	image_path varchar NULL,
	gender varchar NOT NULL,
	birthdate timestamp NULL,
	newsletter_subscribed bool NOT NULL,
	CONSTRAINT "User_email_key" UNIQUE (email),
	CONSTRAINT "User_phone_number_key" UNIQUE (phone_number),
	CONSTRAINT "User_pkey" PRIMARY KEY (id)
);


-- public.address definition

-- Drop table

-- DROP TABLE public.address;

CREATE TABLE public.address (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	country varchar NOT NULL,
	state varchar NOT NULL,
	city varchar NOT NULL,
	postal_code varchar NULL,
	line_1 varchar NOT NULL,
	line_2 varchar NULL,
	"number" int4 NOT NULL,
	CONSTRAINT address_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);


-- public.favorite_bundle definition

-- Drop table

-- DROP TABLE public.favorite_bundle;

CREATE TABLE public.favorite_bundle (
	user_id uuid NOT NULL,
	bundle_id uuid NOT NULL,
	CONSTRAINT pk_favorite_bundle PRIMARY KEY (user_id, bundle_id),
	CONSTRAINT fk_favorite_bundle_bundle FOREIGN KEY (bundle_id) REFERENCES public.bundle(id) ON DELETE CASCADE,
	CONSTRAINT fk_favorite_bundle_user FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);


-- public."order" definition

-- Drop table

-- DROP TABLE public."order";

CREATE TABLE public."order" (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	country varchar NOT NULL,
	state varchar NOT NULL,
	city varchar NOT NULL,
	postal_code varchar NULL,
	line_1 varchar NOT NULL,
	line_2 varchar NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	"number" varchar NOT NULL,
	delivery timestamp NOT NULL,
	CONSTRAINT order_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);


-- public.payment_method definition

-- Drop table

-- DROP TABLE public.payment_method;

CREATE TABLE public.payment_method (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	card_holder_name varchar NOT NULL,
	card_brand varchar NOT NULL,
	exp_month int4 NOT NULL,
	exp_year int4 NOT NULL,
	card_last4 varchar NOT NULL,
	CONSTRAINT payment_method_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_b9f0b59dc5fd5150f2df494a480" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);


-- public.product definition

-- Drop table

-- DROP TABLE public.product;

CREATE TABLE public.product (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	sku varchar NOT NULL,
	price numeric(10, 2) NOT NULL,
	unit varchar NOT NULL,
	discount_percent int4 NULL,
	bundle_id uuid NULL,
	brand_id uuid NOT NULL,
	image_path varchar NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT product_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_2eb5ce4324613b4b457c364f4a2" FOREIGN KEY (brand_id) REFERENCES public.brand(id) ON DELETE CASCADE,
	CONSTRAINT "FK_f35662270f8bcb3f26dfd6e9fda" FOREIGN KEY (bundle_id) REFERENCES public.bundle(id) ON DELETE SET NULL
);


-- public.product_category definition

-- Drop table

-- DROP TABLE public.product_category;

CREATE TABLE public.product_category (
	product_id uuid NOT NULL,
	category_id uuid NOT NULL,
	CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id),
	CONSTRAINT "FK_0374879a971928bc3f57eed0a59" FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "FK_2df1f83329c00e6eadde0493e16" FOREIGN KEY (category_id) REFERENCES public.category(id)
);
CREATE INDEX "IDX_0374879a971928bc3f57eed0a5" ON public.product_category USING btree (product_id);
CREATE INDEX "IDX_2df1f83329c00e6eadde0493e1" ON public.product_category USING btree (category_id);


-- public.product_tag definition

-- Drop table

-- DROP TABLE public.product_tag;

CREATE TABLE public.product_tag (
	product_id uuid NOT NULL,
	tag_id uuid NOT NULL,
	CONSTRAINT product_tag_pkey PRIMARY KEY (product_id, tag_id),
	CONSTRAINT "FK_7bf0b673c19b33c9456d54b2b37" FOREIGN KEY (tag_id) REFERENCES public.tag(id),
	CONSTRAINT "FK_d08cb260c60a9bf0a5e0424768d" FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IDX_7bf0b673c19b33c9456d54b2b3" ON public.product_tag USING btree (tag_id);
CREATE INDEX "IDX_d08cb260c60a9bf0a5e0424768" ON public.product_tag USING btree (product_id);


-- public.rating_bundle definition

-- Drop table

-- DROP TABLE public.rating_bundle;

CREATE TABLE public.rating_bundle (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	bundle_id uuid NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	rating int4 NULL,
	"comment" varchar NULL,
	CONSTRAINT rating_bundle_pkey PRIMARY KEY (id),
	CONSTRAINT unique_user_bundle_rating UNIQUE (user_id, bundle_id),
	CONSTRAINT "FK_c45525dc778237a9dfc05915448" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE,
	CONSTRAINT "FK_d3009f792deb662df0c82108b30" FOREIGN KEY (bundle_id) REFERENCES public.bundle(id) ON DELETE CASCADE
);


-- public.rating_product definition

-- Drop table

-- DROP TABLE public.rating_product;

CREATE TABLE public.rating_product (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	product_id uuid NOT NULL,
	"comment" text NULL,
	created_at timestamp DEFAULT now() NULL,
	rating int4 NULL,
	CONSTRAINT rating_product_pkey PRIMARY KEY (id),
	CONSTRAINT rating_product_rating_check null,
	CONSTRAINT fk_rating_product_product FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE,
	CONSTRAINT fk_rating_product_user FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE
);


-- public.social definition

-- Drop table

-- DROP TABLE public.social;

CREATE TABLE public.social (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	brand_id uuid NOT NULL,
	link varchar NOT NULL,
	CONSTRAINT social_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_af241f045848acc3070e37dea9a" FOREIGN KEY (brand_id) REFERENCES public.brand(id) ON DELETE CASCADE
);


-- public."subscription" definition

-- Drop table

-- DROP TABLE public."subscription";

CREATE TABLE public."subscription" (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	bundle_id uuid NOT NULL,
	address_id uuid NOT NULL,
	payment_method_id uuid NOT NULL,
	delivery int4 NOT NULL,
	CONSTRAINT subscription_pkey PRIMARY KEY (id),
	CONSTRAINT "FK_45437ed27ffbe2b85e00e9596ae" FOREIGN KEY (address_id) REFERENCES public.address(id) ON DELETE CASCADE,
	CONSTRAINT "FK_a262a43bbd9bdf02e73cf1c4af2" FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(id) ON DELETE CASCADE,
	CONSTRAINT "FK_fb86e895f69f044947937822b58" FOREIGN KEY (bundle_id) REFERENCES public.bundle(id) ON DELETE CASCADE
);


-- public.user_bundle definition

-- Drop table

-- DROP TABLE public.user_bundle;

CREATE TABLE public.user_bundle (
	user_id uuid NOT NULL,
	bundle_id uuid NOT NULL,
	CONSTRAINT user_bundle_pkey PRIMARY KEY (user_id, bundle_id),
	CONSTRAINT "FK_3f2716b73c7c1069a7749cb5ab4" FOREIGN KEY (bundle_id) REFERENCES public.bundle(id),
	CONSTRAINT "FK_ee7a9293c2e447c16c8d5f3bf44" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IDX_3f2716b73c7c1069a7749cb5ab" ON public.user_bundle USING btree (bundle_id);
CREATE INDEX "IDX_ee7a9293c2e447c16c8d5f3bf4" ON public.user_bundle USING btree (user_id);


-- public.favorite_product definition

-- Drop table

-- DROP TABLE public.favorite_product;

CREATE TABLE public.favorite_product (
	user_id uuid NOT NULL,
	product_id uuid NOT NULL,
	CONSTRAINT pk_favorite_product PRIMARY KEY (user_id, product_id),
	CONSTRAINT "FK_a21c00544c6e01fa89c1f3496a4" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "FK_e8a2e36c5e33dc12de4169a6f8a" FOREIGN KEY (product_id) REFERENCES public.product(id)
);
CREATE INDEX "IDX_a21c00544c6e01fa89c1f3496a" ON public.favorite_product USING btree (user_id);
CREATE INDEX "IDX_e8a2e36c5e33dc12de4169a6f8" ON public.favorite_product USING btree (product_id);


-- public.order_row definition

-- Drop table

-- DROP TABLE public.order_row;

CREATE TABLE public.order_row (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	order_id uuid NOT NULL,
	product_id uuid NOT NULL,
	quantity int4 DEFAULT 1 NOT NULL,
	CONSTRAINT order_row_pkey PRIMARY KEY (id),
	CONSTRAINT order_row_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(id) ON DELETE CASCADE,
	CONSTRAINT order_row_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE
);



-- DROP FUNCTION public.uuid_generate_v1();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- DROP FUNCTION public.uuid_generate_v1mc();

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- DROP FUNCTION public.uuid_generate_v4();

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- DROP FUNCTION public.uuid_nil();

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- DROP FUNCTION public.uuid_ns_dns();

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- DROP FUNCTION public.uuid_ns_oid();

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- DROP FUNCTION public.uuid_ns_url();

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- DROP FUNCTION public.uuid_ns_x500();

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;