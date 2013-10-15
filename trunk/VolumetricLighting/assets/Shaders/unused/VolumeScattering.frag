/*
* fragment shader template
*/

/*auxiliary functions*/
const float PI = 3.1415926535;

varying vec4 objPos;
varying vec3 normal;
varying vec3 lightPosition;
varying vec3 viewPosition;
varying float lightIntensity;
varying float beta; // Scattering coefﬁcient of the participating medium
//varying float Kd;
//varying float Ks;
				
uniform sampler2D F;
const float f_XOffset =0.0;
const float f_XScale = 1.0;
const float f_YOffset = 0.0;
const float f_YScale = 1.0;



float A0(float I0, float beta, float Dsv, float gamma) {
	return (beta*I0*exp(-beta*Dsv*cos(gamma)))/(2*PI*Dsv*sin(gamma));
}
float A1(float beta, float Dsv, float gamma) {
	return beta*Dsv*sin(gamma);
}

/*functions to compute each radiance component seperately*/
float AirLight(float lightIntensity, 
		float beta, 
		float Dsv, 
		float Dvp, 
		float gammasv,
		sampler2D F,
		float f_XOffset, 
		float f_XScale, 
		float f_YOffset,		
		float f_YScale) {
	
	float u = A1(beta, Dsv, gammasv);
	float v1 = 0.25*PI+0.5*atan((Dvp-Dsv*cos(gammasv))/(Dsv*sin(gammasv)));
	float v2 = 0.5*gammasv;
			
	float4 f_1= 1.0; //texRECT(F, float2((v1-f_XOffset)*f_XScale, (u-f_YOffset)*f_YScale));
	float4 f_2= 0.5;//texRECT(F, float2((v2-f_XOffset)*f_XScale, (u-f_YOffset)*f_YScale));
	return A0(lightIntensity, beta, Dsv, gammasv)*(f_1.x-f_2.x);
}
void main() {
    // Set the fragment color for example to gray, alpha 1.0
	/*preparing parameters*/
	vec3 N = normalize(normal);
	vec3 V = normalize(objPos.xyz-viewPosition.xyz);
	vec3 S = normalize(lightPosition-viewPosition);
	//vec3 L = normalize(lightPosition-objPos.xyz);
	//vec3 RV = reflect(V, N);

	float Dvp = length(viewPosition-objPos.xyz);
	float Dsv = length(lightPosition-viewPosition);
	//float Dsp = length(lightPosition-objPos.xyz);
	float gamma = acos(dot(S, V));
	//float thetas = acos(dot(N, L));
	//float thetas_ = acos(dot(L, RV));

	/*compute airlight, diffuse and specular color seperately using our model in the paper*/
	float airlight = AirLight(lightIntensity, beta, Dsv, Dvp, gamma, F, f_XOffset,f_XScale, f_YOffset,f_YScale);

    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);  
}

