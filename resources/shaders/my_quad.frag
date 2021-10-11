#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) out vec4 color;

layout (binding = 0) uniform sampler2D colorTex;

layout (location = 0 ) in VS_OUT
{
  vec2 texCoord;
} surf;

float gaus(float x, float sigma) {
    return exp(-x * x / (2 * sigma));
}

void main()
{
    const int filterSize = 4;
    const vec4 curColor = textureLod(colorTex, surf.texCoord, 0);
    const vec2 step = 1. / textureSize(colorTex, 0);
    vec4 result = vec4(0);
    float weight = 0;

    for (int i = -filterSize; i <= filterSize; ++i) 
    {
        for (int j = -filterSize; j <= filterSize; ++j) 
        {
            vec4 offsetColor = textureLod(colorTex, surf.texCoord + step * vec2(i, j), 0);
            float w = gaus(length(offsetColor - curColor), 0.003) * gaus(length(vec2(i, j)), 5);           
            result += offsetColor * w;
            weight += w;
        }
    }
    color = result / weight;
}